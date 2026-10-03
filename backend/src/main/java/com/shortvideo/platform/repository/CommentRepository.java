package com.shortvideo.platform.repository;

import com.shortvideo.platform.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    Page<Comment> findByVideoIdAndParentCommentIsNullOrderByCreatedAtDesc(UUID videoId, Pageable pageable);

    List<Comment> findByParentCommentIdOrderByCreatedAtAsc(UUID parentCommentId);

    Long countByVideoId(UUID videoId);
}
