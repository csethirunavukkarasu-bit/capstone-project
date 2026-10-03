package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.request.CommentRequest;
import com.shortvideo.platform.dto.request.ViewTrackRequest;
import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.CommentDto;
import com.shortvideo.platform.service.SocialService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
public class SocialController {

    private final SocialService socialService;

    public SocialController(SocialService socialService) {
        this.socialService = socialService;
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<String>> likeVideo(@PathVariable("id") UUID videoId) {
        socialService.likeVideo(videoId);
        return ResponseEntity.ok(ApiResponse.success("Liked video successfully"));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<ApiResponse<String>> unlikeVideo(@PathVariable("id") UUID videoId) {
        socialService.unlikeVideo(videoId);
        return ResponseEntity.ok(ApiResponse.success("Unliked video successfully"));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable("id") UUID videoId,
            @Valid @RequestBody CommentRequest request) {
        CommentDto comment = socialService.addComment(videoId, request);
        return new ResponseEntity<>(
                ApiResponse.success("Comment posted successfully", comment),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<Page<CommentDto>>> getVideoComments(
            @PathVariable("id") UUID videoId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<CommentDto> comments = socialService.getVideoComments(videoId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Video comments retrieved", comments));
    }

    @GetMapping("/comments/{commentId}/replies")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getCommentReplies(
            @PathVariable("commentId") UUID commentId) {
        List<CommentDto> replies = socialService.getCommentReplies(commentId);
        return ResponseEntity.ok(ApiResponse.success("Comment replies retrieved", replies));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<String>> trackView(
            @PathVariable("id") UUID videoId,
            @Valid @RequestBody ViewTrackRequest request) {
        socialService.trackView(videoId, request);
        return ResponseEntity.ok(ApiResponse.success("Watch metrics recorded"));
    }
}
