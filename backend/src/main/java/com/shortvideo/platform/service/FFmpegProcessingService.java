package com.shortvideo.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class FFmpegProcessingService {

    private static final Logger log = LoggerFactory.getLogger(FFmpegProcessingService.class);

    public double extractDuration(File videoFile) {
        try {
            ProcessBuilder pb = new ProcessBuilder("ffprobe", "-v", "error", "-show_entries",
                    "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", videoFile.getAbsolutePath());
            Process process = pb.start();
            String output = new String(process.getInputStream().readAllBytes()).trim();
            process.waitFor();
            if (!output.isEmpty()) {
                return Double.parseDouble(output);
            }
        } catch (Exception e) {
            log.debug("FFprobe not available on system. Using estimated duration based on file size.");
        }
        // Fallback estimation (1MB ~ 3 seconds for mobile short videos)
        long fileSize = videoFile.length();
        return Math.max(5.0, Math.min(180.0, fileSize / (350 * 1024.0)));
    }

    public File generateThumbnail(File videoFile) throws IOException {
        File thumbnailFile = File.createTempFile("thumb_", ".jpg");
        
        try {
            ProcessBuilder pb = new ProcessBuilder("ffmpeg", "-y", "-i", videoFile.getAbsolutePath(),
                    "-ss", "00:00:01.000", "-vframes", "1", "-vf", "scale=480:-1", thumbnailFile.getAbsolutePath());
            Process process = pb.start();
            int exitCode = process.waitFor();
            if (exitCode == 0 && thumbnailFile.exists() && thumbnailFile.length() > 0) {
                log.info("FFmpeg generated video thumbnail successfully: {}", thumbnailFile.getAbsolutePath());
                return thumbnailFile;
            }
        } catch (Exception e) {
            log.debug("FFmpeg binary not found on system path. Using Java graphics thumbnail generator.");
        }

        // Fallback thumbnail generator: Create clean placeholder JPEG thumbnail image
        return createFallbackThumbnail(thumbnailFile);
    }

    private File createFallbackThumbnail(File outputFile) throws IOException {
        int width = 480;
        int height = 854; // 9:16 vertical TikTok ratio
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();

        // Beautiful gradient background
        GradientPaint gradient = new GradientPaint(0, 0, new Color(18, 18, 20), width, height, new Color(254, 44, 85));
        g2d.setPaint(gradient);
        g2d.fillRect(0, 0, width, height);

        // Draw Play icon
        g2d.setColor(Color.WHITE);
        int[] xPoints = {width / 2 - 20, width / 2 - 20, width / 2 + 30};
        int[] yPoints = {height / 2 - 30, height / 2 + 30, height / 2};
        g2d.fillPolygon(xPoints, yPoints, 3);

        g2d.setFont(new Font("SansSerif", Font.BOLD, 24));
        g2d.drawString("TikTok Short Video", width / 2 - 100, height / 2 + 100);

        g2d.dispose();
        ImageIO.write(image, "jpg", outputFile);
        return outputFile;
    }
}
