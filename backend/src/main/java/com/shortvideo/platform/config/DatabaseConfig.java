package com.shortvideo.platform.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/postgres}")
    private String dbUrl;

    @Value("${spring.datasource.username:postgres}")
    private String dbUsername;

    @Value("${spring.datasource.password:postgres}")
    private String dbPassword;

    @Value("${DATABASE_URL:#{null}}")
    private String renderDatabaseUrl;

    @Value("${USE_IN_MEMORY_DB:false}")
    private boolean useInMemoryDb;

    @Bean
    @Primary
    public DataSource dataSource() {
        String effectiveUrl = renderDatabaseUrl != null && !renderDatabaseUrl.isBlank() ? renderDatabaseUrl.trim() : dbUrl;
        String effectiveUser = dbUsername;
        String effectivePass = dbPassword;

        // Automatically convert Render/Supabase postgres:// or postgresql:// to JDBC format
        if (effectiveUrl != null && (effectiveUrl.startsWith("postgres://") || effectiveUrl.startsWith("postgresql://"))) {
            try {
                java.net.URI uri = new java.net.URI(effectiveUrl);
                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    effectiveUser = userInfo[0];
                    if (userInfo.length > 1) {
                        effectivePass = userInfo[1];
                    }
                }
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String query = uri.getQuery() != null ? "?" + uri.getQuery() : "?sslmode=require";
                effectiveUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath() + query;
            } catch (Exception e) {
                log.warn("Failed to parse DATABASE_URL as URI, using as-is: {}", e.getMessage());
            }
        }

        if (useInMemoryDb || isDefaultPlaceholder(effectiveUrl)) {
            log.info("Using embedded H2 database mode (USE_IN_MEMORY_DB=true or placeholder DB URL detected).");
            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:shortvideodb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL")
                    .username("sa")
                    .password("")
                    .build();
        }

        log.info("Connecting to PostgreSQL database at URL: {}", maskUrl(effectiveUrl));
        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(effectiveUrl)
                .username(effectiveUser)
                .password(effectivePass)
                .build();
    }

    private boolean isDefaultPlaceholder(String url) {
        return url == null || url.contains("example.supabase.co") || url.contains("localhost:5432/postgres");
    }

    private String maskUrl(String url) {
        if (url == null) return "N/A";
        return url.replaceAll("://[^:]+:[^@]+@", "://***:***@");
    }
}
