package com.shortvideo.platform.service;

import com.shortvideo.platform.dto.request.LoginRequest;
import com.shortvideo.platform.dto.request.RegisterRequest;
import com.shortvideo.platform.dto.response.AuthResponse;
import com.shortvideo.platform.dto.response.UserDto;
import com.shortvideo.platform.entity.User;
import com.shortvideo.platform.repository.UserRepository;
import com.shortvideo.platform.security.JwtTokenProvider;
import com.shortvideo.platform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername().toLowerCase().trim())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .bio(request.getBio())
                .profilePictureUrl(request.getProfilePictureUrl())
                .followerCount(0)
                .followingCount(0)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user: {}", savedUser.getUsername());

        String jwtToken = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getUsername());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String jwtToken = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalArgumentException("No authenticated user found in SecurityContext");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userPrincipal.getId()));

        return UserDto.fromEntity(user);
    }
}
