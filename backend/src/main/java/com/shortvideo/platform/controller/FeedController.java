package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.service.FeedService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<Page<VideoDto>>> getLatestFeed(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<VideoDto> feed = feedService.getLatestFeed(pageable);
        return ResponseEntity.ok(ApiResponse.success("Latest videos feed", feed));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<Page<VideoDto>>> getTrendingFeed(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<VideoDto> feed = feedService.getTrendingFeed(pageable);
        return ResponseEntity.ok(ApiResponse.success("Trending videos feed", feed));
    }

    @GetMapping("/following")
    public ResponseEntity<ApiResponse<Page<VideoDto>>> getFollowingFeed(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<VideoDto> feed = feedService.getFollowingFeed(pageable);
        return ResponseEntity.ok(ApiResponse.success("Following creators video feed", feed));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<VideoDto>>> getCategoryFeed(
            @PathVariable("category") String category,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<VideoDto> feed = feedService.getCategoryFeed(category, pageable);
        return ResponseEntity.ok(ApiResponse.success("Category video feed for " + category, feed));
    }
}
