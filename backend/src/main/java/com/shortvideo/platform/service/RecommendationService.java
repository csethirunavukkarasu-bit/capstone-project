package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.entity.UserInterest;
import com.shortvideo.platform.entity.Video;
import com.shortvideo.platform.repository.LikeRepository;
import com.shortvideo.platform.repository.UserInterestRepository;
import com.shortvideo.platform.repository.VideoRepository;
import com.shortvideo.platform.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final VideoRepository videoRepository;
    private final UserInterestRepository userInterestRepository;
    private final LikeRepository likeRepository;

    public RecommendationService(VideoRepository videoRepository,
                                 UserInterestRepository userInterestRepository,
                                 LikeRepository likeRepository) {
        this.videoRepository = videoRepository;
        this.userInterestRepository = userInterestRepository;
        this.likeRepository = likeRepository;
    }

    @Transactional(readOnly = true)
    public Page<VideoDto> getPersonalizedRecommendationFeed(Pageable pageable) {
        UUID currentUserId = getCurrentUserIdOrNull();

        // Retrieve candidate videos (status = READY)
        List<Video> candidates = videoRepository.findAll().stream()
                .filter(v -> "READY".equalsIgnoreCase(v.getStatus()))
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            return Page.empty(pageable);
        }

        // Map user interests
        Map<String, Double> interestWeights = new HashMap<>();
        if (currentUserId != null) {
            List<UserInterest> interests = userInterestRepository.findByUserIdOrderByScoreDesc(currentUserId);
            for (UserInterest interest : interests) {
                interestWeights.put(interest.getCategory(), interest.getScore());
            }
        }

        // Compute rule-based recommendation score for each candidate video
        List<ScoredVideo> scoredVideos = new ArrayList<>();
        OffsetDateTime now = OffsetDateTime.now();

        for (Video video : candidates) {
            double score = calculateVideoScore(video, interestWeights, now);
            scoredVideos.add(new ScoredVideo(video, score));
        }

        // Sort by score descending
        scoredVideos.sort((sv1, sv2) -> Double.compare(sv2.score, sv1.score));

        // Paginate results
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), scoredVideos.size());
        List<ScoredVideo> paginated = start < scoredVideos.size() ? scoredVideos.subList(start, end) : Collections.emptyList();

        Set<UUID> likedVideoIds = new HashSet<>();
        if (currentUserId != null) {
            for (ScoredVideo sv : paginated) {
                if (likeRepository.existsByUserIdAndVideoId(currentUserId, sv.video.getId())) {
                    likedVideoIds.add(sv.video.getId());
                }
            }
        }

        List<VideoDto> dtos = paginated.stream()
                .map(sv -> VideoDto.fromEntity(sv.video, likedVideoIds.contains(sv.video.getId())))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, scoredVideos.size());
    }

    private double calculateVideoScore(Video video, Map<String, Double> interestWeights, OffsetDateTime now) {
        // 1. Interest Weight (35%)
        double categoryScore = interestWeights.getOrDefault(video.getCategory(), 1.0);
        double interestComponent = Math.min(5.0, categoryScore) / 5.0 * 35.0;

        // 2. Engagement Popularity (25%)
        long views = video.getViewCount() != null ? video.getViewCount() : 0L;
        long likes = video.getLikeCount() != null ? video.getLikeCount() : 0L;
        long comments = video.getCommentCount() != null ? video.getCommentCount() : 0L;
        double engagementRatio = views > 0 ? (likes * 2.0 + comments * 3.0) / Math.max(10.0, views) : 0.5;
        double popularityComponent = Math.min(1.0, engagementRatio) * 25.0;

        // 3. View Count Scaled Weight (25%)
        double viewComponent = Math.min(1.0, Math.log10(views + 1) / 5.0) * 25.0;

        // 4. Recency Decay Factor (15%)
        long hoursOld = video.getCreatedAt() != null ? Math.max(0, Duration.between(video.getCreatedAt(), now).toHours()) : 100;
        double recencyMultiplier = Math.exp(-0.02 * hoursOld);
        double recencyComponent = recencyMultiplier * 15.0;

        return interestComponent + popularityComponent + viewComponent + recencyComponent;
    }

    private UUID getCurrentUserIdOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        if (auth.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return userPrincipal.getId();
        }
        return null;
    }

    private static class ScoredVideo {
        Video video;
        double score;

        ScoredVideo(Video video, double score) {
            this.video = video;
            this.score = score;
        }
    }
}
