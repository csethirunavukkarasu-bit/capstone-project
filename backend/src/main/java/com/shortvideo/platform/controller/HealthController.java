package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.HealthResponse;
import com.shortvideo.platform.service.HealthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthResponse>> getHealthStatus() {
        HealthResponse health = healthService.checkHealth();
        
        HttpStatus status = "UP".equals(health.getStatus()) ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        
        return new ResponseEntity<>(
                ApiResponse.success("Short Video Platform Backend Service is operational", health),
                status
        );
    }
}
