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
public class UserDto {

    private UUID id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String profilePictureUrl;
    private Integer followerCount;
    private Integer followingCount;
    private OffsetDateTime createdAt;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .followerCount(user.getFollowerCount())
                .followingCount(user.getFollowingCount())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
