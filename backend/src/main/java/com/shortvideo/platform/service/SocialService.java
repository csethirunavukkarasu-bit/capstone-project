package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.request.CommentRequest;
import com.shortvideo.platform.dto.request.ViewTrackRequest;
import com.shortvideo.platform.dto.response.CommentDto;
import com.shortvideo.platform.entity.*;
import com.shortvideo.platform.repository.*;
import com.shortvideo.platform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SocialService {

    private static final Logger log = LoggerFactory.getLogger(SocialService.class);

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final VideoViewRepository videoViewRepository;
    private final UserInterestRepository userInterestRepository;

    public SocialService(VideoRepository videoRepository,
                         UserRepository userRepository,
                         LikeRepository likeRepository,
                         CommentRepository commentRepository,
                         VideoViewRepository videoViewRepository,
                         UserInterestRepository userInterestRepository) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.videoViewRepository = videoViewRepository;
        this.userInterestRepository = userInterestRepository;
    }

    @Transactional
    public void likeVideo(UUID videoId) {
        UUID currentUserId = getCurrentUserIdRequired();

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        if (likeRepository.existsByUserIdAndVideoId(currentUserId, videoId)) {
            log.info("User {} already liked video {}", currentUserId, videoId);
            return;
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Like like = Like.builder()
                .user(user)
                .video(video)
                .build();

        likeRepository.save(like);

        // Update video like counter
        video.setLikeCount((video.getLikeCount() == null ? 0 : video.getLikeCount()) + 1);
        videoRepository.save(video);

        // Update user category interest score (+0.5 for liking a category)
        updateUserInterest(user, video.getCategory(), 0.5);

        log.info("User {} liked video {}", currentUserId, videoId);
    }

    @Transactional
    public void unlikeVideo(UUID videoId) {
        UUID currentUserId = getCurrentUserIdRequired();

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        if (!likeRepository.existsByUserIdAndVideoId(currentUserId, videoId)) {
            log.info("User {} had not liked video {}", currentUserId, videoId);
            return;
        }

        likeRepository.deleteByUserIdAndVideoId(currentUserId, videoId);

        // Decrement video like counter
        video.setLikeCount(Math.max(0, (video.getLikeCount() == null ? 1 : video.getLikeCount()) - 1));
        videoRepository.save(video);

        log.info("User {} unliked video {}", currentUserId, videoId);
    }

    @Transactional
    public CommentDto addComment(UUID videoId, CommentRequest request) {
        UUID currentUserId = getCurrentUserIdRequired();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        Comment parentComment = null;
        if (request.getParentCommentId() != null) {
            parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found: " + request.getParentCommentId()));
        }

        Comment comment = Comment.builder()
                .user(user)
                .video(video)
                .parentComment(parentComment)
                .content(request.getContent())
                .likeCount(0)
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Increment comment count on video
        video.setCommentCount((video.getCommentCount() == null ? 0 : video.getCommentCount()) + 1);
        videoRepository.save(video);

        // Boost interest score (+0.8 for commenting)
        updateUserInterest(user, video.getCategory(), 0.8);

        return CommentDto.fromEntity(savedComment);
    }

    @Transactional(readOnly = true)
    public Page<CommentDto> getVideoComments(UUID videoId, Pageable pageable) {
        return commentRepository.findByVideoIdAndParentCommentIsNullOrderByCreatedAtDesc(videoId, pageable)
                .map(CommentDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentReplies(UUID commentId) {
        return commentRepository.findByParentCommentIdOrderByCreatedAtAsc(commentId).stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void trackView(UUID videoId, ViewTrackRequest request) {
        UUID currentUserId = getCurrentUserIdOrNull();

        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        User user = currentUserId != null ? userRepository.findById(currentUserId).orElse(null) : null;

        VideoView view = VideoView.builder()
                .user(user)
                .video(video)
                .watchTime(request.getWatchTime() != null ? request.getWatchTime() : 0.0)
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .build();

        videoViewRepository.save(view);

        // Increment total view count on video
        video.setViewCount((video.getViewCount() == null ? 0 : video.getViewCount()) + 1);
        videoRepository.save(video);

        if (user != null) {
            double weight = request.getCompleted() ? 1.0 : (request.getWatchTime() / Math.max(1.0, video.getDuration()));
            updateUserInterest(user, video.getCategory(), Math.min(1.5, weight));
        }

        log.debug("Recorded view on video [{}], watchTime: {}s, completed: {}", videoId, request.getWatchTime(), request.getCompleted());
    }

    private void updateUserInterest(User user, String category, double deltaScore) {
        if (category == null || category.isBlank()) return;
        
        Optional<UserInterest> optionalInterest = userInterestRepository.findByUserIdAndCategory(user.getId(), category);
        UserInterest interest;
        if (optionalInterest.isPresent()) {
            interest = optionalInterest.get();
            interest.setScore(interest.getScore() + deltaScore);
        } else {
            interest = UserInterest.builder()
                    .user(user)
                    .category(category)
                    .score(1.0 + deltaScore)
                    .build();
        }
        userInterestRepository.save(interest);
    }

    private UUID getCurrentUserIdRequired() {
        UUID userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new IllegalArgumentException("Unauthorized: Please log in to perform this action");
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
