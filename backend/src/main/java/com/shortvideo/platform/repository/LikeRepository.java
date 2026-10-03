package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {

    Optional<Like> findByUserIdAndVideoId(UUID userId, UUID videoId);

    Boolean existsByUserIdAndVideoId(UUID userId, UUID videoId);

    Long countByVideoId(UUID videoId);

    void deleteByUserIdAndVideoId(UUID userId, UUID videoId);
}
