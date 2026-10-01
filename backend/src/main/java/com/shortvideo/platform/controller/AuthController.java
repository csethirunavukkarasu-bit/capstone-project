package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.request.LoginRequest;
import com.shortvideo.platform.dto.request.RegisterRequest;
import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.AuthResponse;
import com.shortvideo.platform.dto.response.UserDto;
import com.shortvideo.platform.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("User registered successfully", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", currentUser));
    }
}
