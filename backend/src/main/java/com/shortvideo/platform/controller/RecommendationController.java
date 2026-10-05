package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.service.RecommendationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<Page<VideoDto>>> getPersonalizedRecommendationFeed(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<VideoDto> feed = recommendationService.getPersonalizedRecommendationFeed(pageable);
        return ResponseEntity.ok(ApiResponse.success("Personalized recommendation video feed", feed));
    }
}
