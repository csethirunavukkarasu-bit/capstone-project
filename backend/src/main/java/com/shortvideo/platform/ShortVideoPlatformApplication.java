package com.shortvideo.platform;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class ShortVideoPlatformApplication {

    private static final Logger log = LoggerFactory.getLogger(ShortVideoPlatformApplication.class);

    public static void main(String[] args) {
        // Load environment variables from .env file if present
        File envFile = new File(".env");
        if (envFile.exists()) {
            log.info("Loading environment variables from .env file...");
            Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
            dotenv.entries().forEach(entry -> {
                if (System.getProperty(entry.getKey()) == null) {
                    System.setProperty(entry.getKey(), entry.getValue());
                }
            });
        } else {
            log.info(".env file not found, relying on system environment variables.");
        }

        SpringApplication.run(ShortVideoPlatformApplication.class, args);
    }

}
