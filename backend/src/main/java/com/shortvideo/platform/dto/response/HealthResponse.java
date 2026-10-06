package com.shortvideo.platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthResponse {

    private String status; // UP, DOWN, DEGRADED
    private LocalDateTime timestamp;
    private String activeProfile;
    private DatabaseHealth database;
    private Map<String, Object> systemInfo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatabaseHealth {
        private boolean connected;
        private String databaseProduct;
        private String details;
        private Long pingLatencyMs;
    }
}
