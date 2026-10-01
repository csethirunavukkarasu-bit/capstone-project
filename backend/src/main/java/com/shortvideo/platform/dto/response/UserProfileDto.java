package com.shortvideo.platform.dto.response;

import com.shortvideo.platform.entity.User;
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
public class UserProfileDto {

    private UUID id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String profilePictureUrl;
    private Integer followerCount;
    private Integer followingCount;
    private Boolean isFollowing;
    private Boolean isSelf;
    private OffsetDateTime createdAt;

    public static UserProfileDto fromEntity(User user, Boolean isFollowing, Boolean isSelf) {
        if (user == null) return null;
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .followerCount(user.getFollowerCount() != null ? user.getFollowerCount() : 0)
                .followingCount(user.getFollowingCount() != null ? user.getFollowingCount() : 0)
                .isFollowing(isFollowing != null ? isFollowing : false)
                .isSelf(isSelf != null ? isSelf : false)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
