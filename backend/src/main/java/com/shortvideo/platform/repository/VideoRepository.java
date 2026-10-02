package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface VideoRepository extends JpaRepository<Video, UUID> {

    Page<Video> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    Page<Video> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, String status, Pageable pageable);

    Page<Video> findByCategoryAndStatusOrderByCreatedAtDesc(String category, String status, Pageable pageable);

    @Query("SELECT v FROM Video v WHERE v.status = 'READY' ORDER BY (v.likeCount * 2 + v.commentCount * 3 + v.viewCount) DESC")
    Page<Video> findTrendingVideos(Pageable pageable);

    List<Video> findByUserId(UUID userId);
}
