package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {

    Optional<Follow> findByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    Boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    Long countByFollowerId(UUID followerId);

    Long countByFollowingId(UUID followingId);

    Page<Follow> findByFollowerIdOrderByCreatedAtDesc(UUID followerId, Pageable pageable);

    Page<Follow> findByFollowingIdOrderByCreatedAtDesc(UUID followingId, Pageable pageable);

    void deleteByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
}
