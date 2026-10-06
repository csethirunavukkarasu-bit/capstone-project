package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.response.HealthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class HealthService {

    private static final Logger log = LoggerFactory.getLogger(HealthService.class);

    private final JdbcTemplate jdbcTemplate;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public HealthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public HealthResponse checkHealth() {
        long startTime = System.currentTimeMillis();
        boolean dbConnected = false;
        String dbProduct = "Unknown";
        String dbDetails = "";

        try {
            // Execute validation query against Supabase PostgreSQL
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                dbConnected = true;
                
                try {
                    dbProduct = jdbcTemplate.queryForObject("SELECT version()", String.class);
                    if (dbProduct != null && dbProduct.length() > 60) {
                        dbProduct = dbProduct.substring(0, 60) + "...";
                    }
                } catch (Exception e) {
                    dbProduct = "PostgreSQL";
                }
                
                dbDetails = "Database connection is active and responding.";
            } else {
                dbDetails = "Validation query returned unexpected result.";
            }
        } catch (Exception ex) {
            log.error("Database connection check failed: {}", ex.getMessage());
            dbConnected = false;
            dbDetails = "Connection failed: " + ex.getMessage();
        }

        long latency = System.currentTimeMillis() - startTime;

        HealthResponse.DatabaseHealth dbHealth = HealthResponse.DatabaseHealth.builder()
                .connected(dbConnected)
                .databaseProduct(dbProduct)
                .details(dbDetails)
                .pingLatencyMs(latency)
                .build();

        Map<String, Object> sysInfo = new HashMap<>();
        sysInfo.put("javaVersion", System.getProperty("java.version"));
        sysInfo.put("osName", System.getProperty("os.name"));
        sysInfo.put("maxMemoryMb", Runtime.getRuntime().maxMemory() / (1024 * 1024));
        sysInfo.put("freeMemoryMb", Runtime.getRuntime().freeMemory() / (1024 * 1024));

        String overallStatus = dbConnected ? "UP" : "DEGRADED";

        return HealthResponse.builder()
                .status(overallStatus)
                .timestamp(LocalDateTime.now())
                .activeProfile(activeProfile)
                .database(dbHealth)
                .systemInfo(sysInfo)
                .build();
    }
}
