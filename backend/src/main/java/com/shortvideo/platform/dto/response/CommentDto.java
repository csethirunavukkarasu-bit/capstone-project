package com.shortvideo.platform.dto.response;

import com.shortvideo.platform.entity.Comment;
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
public class CommentDto {

    private UUID id;
    private UserDto user;
    private UUID videoId;
    private UUID parentCommentId;
    private String content;
    private Integer likeCount;
    private OffsetDateTime createdAt;

    public static CommentDto fromEntity(Comment comment) {
        if (comment == null) return null;
        return CommentDto.builder()
                .id(comment.getId())
                .user(UserDto.fromEntity(comment.getUser()))
                .videoId(comment.getVideo() != null ? comment.getVideo().getId() : null)
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .content(comment.getContent())
                .likeCount(comment.getLikeCount() != null ? comment.getLikeCount() : 0)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
