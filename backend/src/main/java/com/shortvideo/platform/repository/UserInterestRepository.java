package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserInterestRepository extends JpaRepository<UserInterest, UUID> {

    List<UserInterest> findByUserIdOrderByScoreDesc(UUID userId);

    Optional<UserInterest> findByUserIdAndCategory(UUID userId, String category);

    void deleteByUserId(UUID userId);
}
