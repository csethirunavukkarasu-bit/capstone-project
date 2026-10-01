package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.request.UpdateProfileRequest;
import com.shortvideo.platform.dto.response.UserDto;
import com.shortvideo.platform.dto.response.UserProfileDto;
import com.shortvideo.platform.entity.Follow;
import com.shortvideo.platform.entity.User;
import com.shortvideo.platform.repository.FollowRepository;
import com.shortvideo.platform.repository.UserRepository;
import com.shortvideo.platform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfileByUsername(String username) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

        UUID currentUserId = getCurrentUserIdOrNull();

        boolean isSelf = currentUserId != null && currentUserId.equals(targetUser.getId());
        boolean isFollowing = false;

        if (currentUserId != null && !isSelf) {
            isFollowing = followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUser.getId());
        }

        return UserProfileDto.fromEntity(targetUser, isFollowing, isSelf);
    }

    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {
        UUID currentUserId = getCurrentUserIdRequired();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + currentUserId));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        User updatedUser = userRepository.save(user);
        log.info("Profile updated for user: {}", updatedUser.getUsername());

        return UserDto.fromEntity(updatedUser);
    }

    @Transactional
    public void followUser(UUID targetUserId) {
        UUID currentUserId = getCurrentUserIdRequired();

        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot follow yourself");
        }

        User follower = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        if (followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId)) {
            log.info("User {} is already following user {}", currentUserId, targetUserId);
            return;
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(targetUser)
                .build();

        followRepository.save(follow);

        // Update counts
        follower.setFollowingCount((follower.getFollowingCount() == null ? 0 : follower.getFollowingCount()) + 1);
        targetUser.setFollowerCount((targetUser.getFollowerCount() == null ? 0 : targetUser.getFollowerCount()) + 1);

        userRepository.save(follower);
        userRepository.save(targetUser);

        log.info("User {} is now following user {}", follower.getUsername(), targetUser.getUsername());
    }

    @Transactional
    public void unfollowUser(UUID targetUserId) {
        UUID currentUserId = getCurrentUserIdRequired();

        if (currentUserId.equals(targetUserId)) {
            throw new IllegalArgumentException("You cannot unfollow yourself");
        }

        User follower = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));

        if (!followRepository.existsByFollowerIdAndFollowingId(currentUserId, targetUserId)) {
            log.info("User {} was not following user {}", currentUserId, targetUserId);
            return;
        }

        followRepository.deleteByFollowerIdAndFollowingId(currentUserId, targetUserId);

        // Decrement counts
        follower.setFollowingCount(Math.max(0, (follower.getFollowingCount() == null ? 1 : follower.getFollowingCount()) - 1));
        targetUser.setFollowerCount(Math.max(0, (targetUser.getFollowerCount() == null ? 1 : targetUser.getFollowerCount()) - 1));

        userRepository.save(follower);
        userRepository.save(targetUser);

        log.info("User {} unfollowed user {}", follower.getUsername(), targetUser.getUsername());
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getFollowers(UUID userId, Pageable pageable) {
        return followRepository.findByFollowingIdOrderByCreatedAtDesc(userId, pageable)
                .map(follow -> UserDto.fromEntity(follow.getFollower()));
    }

    @Transactional(readOnly = true)
    public Page<UserDto> getFollowing(UUID userId, Pageable pageable) {
        return followRepository.findByFollowerIdOrderByCreatedAtDesc(userId, pageable)
                .map(follow -> UserDto.fromEntity(follow.getFollowing()));
    }

    @Transactional(readOnly = true)
    public Page<UserDto> searchUsers(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return Page.empty();
        }
        return userRepository.findByUsernameContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(query, query, pageable)
                .map(UserDto::fromEntity);
    }

    private UUID getCurrentUserIdRequired() {
        UUID userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new IllegalArgumentException("Unauthorized access: User is not logged in");
        }
        return userId;
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
}
