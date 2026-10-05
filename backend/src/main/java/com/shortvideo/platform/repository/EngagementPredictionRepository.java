package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.EngagementPrediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EngagementPredictionRepository extends JpaRepository<EngagementPrediction, UUID> {

    Optional<EngagementPrediction> findByVideoId(UUID videoId);

    Page<EngagementPrediction> findByOrderByViralScoreDesc(Pageable pageable);
}
