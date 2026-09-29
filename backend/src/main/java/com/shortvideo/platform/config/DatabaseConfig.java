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

    @Value("${USE_IN_MEMORY_DB:false}")
    private boolean useInMemoryDb;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (useInMemoryDb || isDefaultPlaceholder(dbUrl)) {
            log.info("Using embedded H2 database mode (USE_IN_MEMORY_DB=true or placeholder DB URL detected).");
            return DataSourceBuilder.create()
                    .driverClassName("org.h2.Driver")
                    .url("jdbc:h2:mem:shortvideodb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL")
                    .username("sa")
                    .password("")
                    .build();
        }

        log.info("Connecting to Supabase PostgreSQL database at URL: {}", maskUrl(dbUrl));
        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(dbUrl)
                .username(dbUsername)
                .password(dbPassword)
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
