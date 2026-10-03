package com.shortvideo.platform.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ViewTrackRequest {

    @NotNull(message = "Watch time is required")
    private Double watchTime;

    @Builder.Default
    private Boolean completed = false;
}
