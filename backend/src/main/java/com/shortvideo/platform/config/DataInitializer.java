package com.shortvideo.platform.config;

import com.shortvideo.platform.entity.User;
import com.shortvideo.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User user = User.builder()
                        .username("testuser")
                        .email("test@test.com")
                        .passwordHash(passwordEncoder.encode("test123"))
                        .displayName("Test User")
                        .bio("Default test account")
                        .followerCount(0)
                        .followingCount(0)
                        .build();
                userRepository.save(user);
            }
        };
    }
}
