package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.request.VideoUploadRequest;
import com.shortvideo.platform.dto.response.VideoDto;
import com.shortvideo.platform.entity.User;
import com.shortvideo.platform.entity.Video;
import com.shortvideo.platform.repository.LikeRepository;
import com.shortvideo.platform.repository.UserRepository;
import com.shortvideo.platform.repository.VideoRepository;
import com.shortvideo.platform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class VideoService {

    private static final Logger log = LoggerFactory.getLogger(VideoService.class);

    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final SupabaseStorageService storageService;
    private final FFmpegProcessingService ffmpegService;

    public VideoService(VideoRepository videoRepository,
                        UserRepository userRepository,
                        LikeRepository likeRepository,
                        SupabaseStorageService storageService,
                        FFmpegProcessingService ffmpegService) {
        this.videoRepository = videoRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.storageService = storageService;
        this.ffmpegService = ffmpegService;
    }

    @Transactional
    public VideoDto uploadVideo(MultipartFile file, VideoUploadRequest request) throws IOException {
        UUID currentUserId = getCurrentUserIdRequired();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + currentUserId));

        // Validate video file
        validateVideoFile(file);

        // Upload video file
        String videoUrl = storageService.uploadFile(file, "videos");

        // Process thumbnail and duration via FFmpeg
        File tempVideoFile = File.createTempFile("vid_", ".tmp");
        try (FileOutputStream fos = new FileOutputStream(tempVideoFile)) {
            fos.write(file.getBytes());
        }

        double duration = ffmpegService.extractDuration(tempVideoFile);
        File thumbnailFile = ffmpegService.generateThumbnail(tempVideoFile);

        String thumbnailUrl = storageService.uploadLocalFile(thumbnailFile, "thumbnails/" + UUID.randomUUID() + ".jpg", "image/jpeg");

        // Cleanup temporary local files
        tempVideoFile.delete();
        thumbnailFile.delete();

        Video video = Video.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .duration(duration)
                .fileSize(file.getSize())
                .mimeType(file.getContentType())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .tags(request.getTags())
                .viewCount(0L)
                .likeCount(0L)
                .commentCount(0L)
                .status("READY")
                .build();

        Video savedVideo = videoRepository.save(video);
        log.info("Successfully uploaded video [{}]: {}", savedVideo.getId(), savedVideo.getTitle());

        return VideoDto.fromEntity(savedVideo, false);
    }

    @Transactional(readOnly = true)
    public VideoDto getVideoById(UUID videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with id: " + videoId));

        UUID currentUserId = getCurrentUserIdOrNull();
        boolean isLiked = currentUserId != null && likeRepository.existsByUserIdAndVideoId(currentUserId, videoId);

        return VideoDto.fromEntity(video, isLiked);
    }

    private void validateVideoFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("video/") && !contentType.equals("application/octet-stream"))) {
            throw new IllegalArgumentException("Invalid file type: File must be a video format (e.g., MP4, WebM)");
        }

        long maxSize = 100 * 1024 * 1024; // 100MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 100MB");
        }
    }

    private UUID getCurrentUserIdRequired() {
        UUID userId = getCurrentUserIdOrNull();
        if (userId == null) {
            throw new IllegalArgumentException("Unauthorized: Please log in to upload videos");
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
