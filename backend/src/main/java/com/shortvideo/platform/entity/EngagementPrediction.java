package com.shortvideo.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "engagement_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EngagementPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "video_id", nullable = false, unique = true)
    private Video video;

    @Column(name = "predicted_views")
    @Builder.Default
    private Long predictedViews = 0L;

    @Column(name = "predicted_like_ratio")
    @Builder.Default
    private Double predictedLikeRatio = 0.0;

    @Column(name = "predicted_completion_rate")
    @Builder.Default
    private Double predictedCompletionRate = 0.0;

    @Column(name = "viral_score")
    @Builder.Default
    private Double viralScore = 0.0;

    @Builder.Default
    @Column(name = "model_version", length = 50)
    private String modelVersion = "v1.0";

    @CreationTimestamp
    @Column(name = "predicted_at", updatable = false)
    private OffsetDateTime predictedAt;
}
