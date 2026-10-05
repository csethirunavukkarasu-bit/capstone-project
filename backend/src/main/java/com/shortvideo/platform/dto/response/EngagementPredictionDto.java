package com.shortvideo.platform.dto.response;

import com.shortvideo.platform.entity.EngagementPrediction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EngagementPredictionDto {

    private UUID id;
    private UUID videoId;
    private Long predictedViews;
    private Double predictedLikeRatio;
    private Double predictedCompletionRate;
    private Double viralScore;
    private String modelVersion;
    private OffsetDateTime predictedAt;

    public static EngagementPredictionDto fromEntity(EngagementPrediction prediction) {
        if (prediction == null) return null;
        return EngagementPredictionDto.builder()
                .id(prediction.getId())
                .videoId(prediction.getVideo() != null ? prediction.getVideo().getId() : null)
                .predictedViews(prediction.getPredictedViews())
                .predictedLikeRatio(prediction.getPredictedLikeRatio())
                .predictedCompletionRate(prediction.getPredictedCompletionRate())
                .viralScore(prediction.getViralScore())
                .modelVersion(prediction.getModelVersion())
                .predictedAt(prediction.getPredictedAt())
                .build();
    }
}
