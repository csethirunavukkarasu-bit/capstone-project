package com.shortvideo.platform.controller;

import com.shortvideo.platform.dto.request.UpdateProfileRequest;
import com.shortvideo.platform.dto.response.ApiResponse;
import com.shortvideo.platform.dto.response.UserDto;
import com.shortvideo.platform.dto.response.UserProfileDto;
import com.shortvideo.platform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserProfile(@PathVariable("username") String username) {
        UserProfileDto profile = userService.getUserProfileByUsername(username);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserDto updatedUser = userService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<String>> followUser(@PathVariable("userId") UUID userId) {
        userService.followUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Successfully followed user"));
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<String>> unfollowUser(@PathVariable("userId") UUID userId) {
        userService.unfollowUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Successfully unfollowed user"));
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getFollowers(
            @PathVariable("userId") UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserDto> followers = userService.getFollowers(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Followers retrieved successfully", followers));
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getFollowing(
            @PathVariable("userId") UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserDto> following = userService.getFollowing(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Following list retrieved successfully", following));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDto>>> searchUsers(
            @RequestParam("q") String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserDto> results = userService.searchUsers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success("User search results", results));
    }
}
