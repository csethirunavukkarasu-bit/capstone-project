package com.shortvideo.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shortvideo.platform.dto.response.EngagementPredictionDto;
import com.shortvideo.platform.entity.EngagementPrediction;
import com.shortvideo.platform.entity.Video;
import com.shortvideo.platform.repository.EngagementPredictionRepository;
import com.shortvideo.platform.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AiServiceConnector {

    private static final Logger log = LoggerFactory.getLogger(AiServiceConnector.class);

    @Value("${AI_SERVICE_URL:http://localhost:8000}")
    private String aiServiceUrl;

    private final VideoRepository videoRepository;
    private final EngagementPredictionRepository predictionRepository;
    private final ObjectMapper objectMapper;

    public AiServiceConnector(VideoRepository videoRepository,
                              EngagementPredictionRepository predictionRepository) {
        this.videoRepository = videoRepository;
        this.predictionRepository = predictionRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional
    public EngagementPredictionDto predictVideoEngagement(UUID videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        Optional<EngagementPrediction> existing = predictionRepository.findByVideoId(videoId);
        if (existing.isPresent()) {
            return EngagementPredictionDto.fromEntity(existing.get());
        }

        EngagementPrediction prediction;
        try {
            prediction = fetchPredictionFromPythonAiService(video);
        } catch (Exception e) {
            log.warn("Python AI Microservice unavailable at [{}]: {}. Using heuristic AI model fallback.", aiServiceUrl, e.getMessage());
            prediction = computeHeuristicAiPrediction(video);
        }

        EngagementPrediction saved = predictionRepository.save(prediction);
        return EngagementPredictionDto.fromEntity(saved);
    }

    private EngagementPrediction fetchPredictionFromPythonAiService(Video video) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("video_id", video.getId().toString());
        payload.put("duration", video.getDuration());
        payload.put("file_size", video.getFileSize());
        payload.put("category", video.getCategory());
        payload.put("creator_follower_count", video.getUser().getFollowerCount());
        payload.put("title_length", video.getTitle() != null ? video.getTitle().length() : 0);

        String jsonBody = objectMapper.writeValueAsString(payload);

        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiServiceUrl + "/predict-engagement"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            return EngagementPrediction.builder()
                    .video(video)
                    .predictedViews(root.path("predicted_views").asLong(1000L))
                    .predictedLikeRatio(root.path("predicted_like_ratio").asDouble(0.08))
                    .predictedCompletionRate(root.path("predicted_completion_rate").asDouble(0.65))
                    .viralScore(root.path("viral_score").asDouble(75.5))
                    .modelVersion("v1.0-python-fastapi")
                    .build();
        } else {
            throw new RuntimeException("AI service returned HTTP " + response.statusCode());
        }
    }

    private EngagementPrediction computeHeuristicAiPrediction(Video video) {
        int followerCount = video.getUser().getFollowerCount() != null ? video.getUser().getFollowerCount() : 0;
        double duration = video.getDuration() != null ? video.getDuration() : 15.0;

        long predictedViews = Math.max(500L, (long) (followerCount * 3.5 + 2500));
        double predictedLikeRatio = Math.min(0.25, 0.05 + (followerCount > 100 ? 0.05 : 0.02));
        double completionRate = Math.max(0.35, Math.min(0.95, 1.0 - (duration / 120.0)));
        double viralScore = Math.min(100.0, (predictedViews / 100.0) * 0.4 + (completionRate * 40.0) + (predictedLikeRatio * 200.0));

        return EngagementPrediction.builder()
                .video(video)
                .predictedViews(predictedViews)
                .predictedLikeRatio(predictedLikeRatio)
                .predictedCompletionRate(completionRate)
                .viralScore(Math.round(viralScore * 10.0) / 10.0)
                .modelVersion("v1.0-heuristic-fallback")
                .build();
    }
}
