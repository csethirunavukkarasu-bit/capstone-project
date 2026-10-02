package com.shortvideo.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);

    @Value("${SUPABASE_URL:https://example.supabase.co}")
    private String supabaseUrl;

    @Value("${SUPABASE_KEY:your-supabase-key}")
    private String supabaseKey;

    @Value("${SUPABASE_STORAGE_BUCKET:videos}")
    private String bucketName;

    private final Path localUploadDir = Paths.get("uploads").toAbsolutePath().normalize();

    public SupabaseStorageService() {
        try {
            Files.createDirectories(localUploadDir);
        } catch (IOException e) {
            log.error("Failed to create local upload directory", e);
        }
    }

    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String uniqueFilename = folder + "/" + UUID.randomUUID() + fileExtension;

        if (isSupabaseConfigured()) {
            try {
                return uploadToSupabase(file.getBytes(), uniqueFilename, file.getContentType());
            } catch (Exception e) {
                log.warn("Supabase upload failed: {}. Falling back to local storage.", e.getMessage());
            }
        }

        return uploadToLocalStorage(file, uniqueFilename);
    }

    public String uploadLocalFile(File file, String remotePath, String contentType) throws IOException {
        byte[] bytes = Files.readAllBytes(file.toPath());
        if (isSupabaseConfigured()) {
            try {
                return uploadToSupabase(bytes, remotePath, contentType);
            } catch (Exception e) {
                log.warn("Supabase upload failed for local file: {}. Using local URL.", e.getMessage());
            }
        }
        
        Path targetPath = localUploadDir.resolve(remotePath);
        Files.createDirectories(targetPath.getParent());
        Files.copy(file.toPath(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + remotePath;
    }

    private String uploadToSupabase(byte[] fileBytes, String filePath, String contentType) throws Exception {
        String targetUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(targetUrl))
                .header("Authorization", "Bearer " + supabaseKey)
                .header("apiKey", supabaseKey)
                .header("Content-Type", contentType != null ? contentType : "application/octet-stream")
                .POST(HttpRequest.BodyPublishers.ofByteArray(fileBytes))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            log.info("Successfully uploaded file to Supabase Storage: {}", filePath);
            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + filePath;
        } else {
            throw new RuntimeException("Supabase Storage error [" + response.statusCode() + "]: " + response.body());
        }
    }

    private String uploadToLocalStorage(MultipartFile file, String relativePath) throws IOException {
        Path targetLocation = localUploadDir.resolve(relativePath);
        Files.createDirectories(targetLocation.getParent());

        file.transferTo(targetLocation.toFile());
        log.info("Saved file locally at: {}", targetLocation);

        return "/uploads/" + relativePath;
    }

    private boolean isSupabaseConfigured() {
        return supabaseUrl != null && !supabaseUrl.contains("example.supabase.co")
                && supabaseKey != null && !supabaseKey.contains("your-supabase-key");
    }
}
