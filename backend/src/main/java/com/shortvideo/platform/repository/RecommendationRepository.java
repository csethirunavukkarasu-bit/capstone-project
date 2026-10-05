package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.Recommendation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {

    Page<Recommendation> findByUserIdOrderByScoreDesc(UUID userId, Pageable pageable);

    Optional<Recommendation> findByUserIdAndVideoId(UUID userId, UUID videoId);

    void deleteByUserId(UUID userId);
}
