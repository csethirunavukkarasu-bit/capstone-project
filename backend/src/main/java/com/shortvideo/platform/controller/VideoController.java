package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.request.VideoUploadRequest;
import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.EngagementPredictionDto;
import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.service.AiServiceConnector;
import com.shortvideo.platform.service.VideoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;
    private final AiServiceConnector aiServiceConnector;

    public VideoController(VideoService videoService, AiServiceConnector aiServiceConnector) {
        this.videoService = videoService;
        this.aiServiceConnector = aiServiceConnector;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<VideoDto>> uploadVideo(
            @RequestPart("file") MultipartFile file,
            @Valid @RequestPart("metadata") VideoUploadRequest request) throws IOException {
        VideoDto video = videoService.uploadVideo(file, request);
        return new ResponseEntity<>(
                ApiResponse.success("Video uploaded and processed successfully", video),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VideoDto>> getVideoById(@PathVariable("id") UUID id) {
        VideoDto video = videoService.getVideoById(id);
        return ResponseEntity.ok(ApiResponse.success("Video metadata retrieved successfully", video));
    }

    @GetMapping("/{id}/ai-prediction")
    public ResponseEntity<ApiResponse<EngagementPredictionDto>> getVideoAiPrediction(@PathVariable("id") UUID id) {
        EngagementPredictionDto prediction = aiServiceConnector.predictVideoEngagement(id);
        return ResponseEntity.ok(ApiResponse.success("AI engagement prediction retrieved", prediction));
    }
}
