package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.VideoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VideoViewRepository extends JpaRepository<VideoView, UUID> {

    Long countByVideoId(UUID videoId);

    List<VideoView> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT SUM(v.watchTime) FROM VideoView v WHERE v.user.id = :userId")
    Double sumWatchTimeByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(v) FROM VideoView v WHERE v.video.id = :videoId AND v.completed = true")
    Long countCompletedViewsByVideoId(@Param("videoId") UUID videoId);
}
