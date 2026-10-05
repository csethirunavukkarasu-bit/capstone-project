package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.entity.Video;
import com.shortvideo.platform.repository.FollowRepository;
import com.shortvideo.platform.repository.LikeRepository;
import com.shortvideo.platform.repository.VideoRepository;
import com.shortvideo.platform.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeedService {

    private final VideoRepository videoRepository;
    private final LikeRepository likeRepository;
    private final FollowRepository followRepository;

    public FeedService(VideoRepository videoRepository,
                       LikeRepository likeRepository,
                       FollowRepository followRepository) {
        this.videoRepository = videoRepository;
        this.likeRepository = likeRepository;
        this.followRepository = followRepository;
    }

    @Transactional(readOnly = true)
    public Page<VideoDto> getLatestFeed(Pageable pageable) {
        Page<Video> videos = videoRepository.findByStatusOrderByCreatedAtDesc("READY", pageable);
        return mapToVideoDtoPage(videos, pageable);
    }

    @Transactional(readOnly = true)
    public Page<VideoDto> getTrendingFeed(Pageable pageable) {
        Page<Video> videos = videoRepository.findTrendingVideos(pageable);
        return mapToVideoDtoPage(videos, pageable);
    }

    @Transactional(readOnly = true)
    public Page<VideoDto> getCategoryFeed(String category, Pageable pageable) {
        Page<Video> videos = videoRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, "READY", pageable);
        return mapToVideoDtoPage(videos, pageable);
    }

    @Transactional(readOnly = true)
    public Page<VideoDto> getFollowingFeed(Pageable pageable) {
        UUID currentUserId = getCurrentUserIdOrNull();
        if (currentUserId == null) {
            return getLatestFeed(pageable);
        }

        List<UUID> followingUserIds = followRepository.findByFollowerIdOrderByCreatedAtDesc(currentUserId, Pageable.unpaged())
                .getContent().stream()
                .map(follow -> follow.getFollowing().getId())
                .collect(Collectors.toList());

        if (followingUserIds.isEmpty()) {
            return getLatestFeed(pageable);
        }

        List<Video> followingVideos = new ArrayList<>();
        for (UUID creatorId : followingUserIds) {
            followingVideos.addAll(videoRepository.findByUserId(creatorId));
        }

        followingVideos.sort((v1, v2) -> v2.getCreatedAt().compareTo(v1.getCreatedAt()));

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), followingVideos.size());
        List<Video> subList = start < followingVideos.size() ? followingVideos.subList(start, end) : Collections.emptyList();

        Page<Video> videoPage = new PageImpl<>(subList, pageable, followingVideos.size());
        return mapToVideoDtoPage(videoPage, pageable);
    }

    private Page<VideoDto> mapToVideoDtoPage(Page<Video> videoPage, Pageable pageable) {
        UUID currentUserId = getCurrentUserIdOrNull();
        Set<UUID> likedVideoIds = new HashSet<>();

        if (currentUserId != null && !videoPage.getContent().isEmpty()) {
            for (Video v : videoPage.getContent()) {
                if (likeRepository.existsByUserIdAndVideoId(currentUserId, v.getId())) {
                    likedVideoIds.add(v.getId());
                }
            }
        }

        return videoPage.map(video -> VideoDto.fromEntity(video, likedVideoIds.contains(video.getId())));
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
