package com.shortvideo.platform.dto.response;

import com.shortvideo.platform.entity.Video;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoDto {

    private UUID id;
    private UserDto user;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Double duration;
    private Long fileSize;
    private String mimeType;
    private String category;
    private String tags;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private Boolean isLiked;
    private String status;
    private OffsetDateTime createdAt;

    public static VideoDto fromEntity(Video video, Boolean isLiked) {
        if (video == null) return null;
        return VideoDto.builder()
                .id(video.getId())
                .user(UserDto.fromEntity(video.getUser()))
                .title(video.getTitle())
                .description(video.getDescription())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .duration(video.getDuration())
                .fileSize(video.getFileSize())
                .mimeType(video.getMimeType())
                .category(video.getCategory())
                .tags(video.getTags())
                .viewCount(video.getViewCount() != null ? video.getViewCount() : 0L)
                .likeCount(video.getLikeCount() != null ? video.getLikeCount() : 0L)
                .commentCount(video.getCommentCount() != null ? video.getCommentCount() : 0L)
                .isLiked(isLiked != null ? isLiked : false)
                .status(video.getStatus())
                .createdAt(video.getCreatedAt())
                .build();
    }
}
