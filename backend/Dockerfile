# ==============================================================================
# Multi-Stage Dockerfile for Reelix Spring Boot Backend (Java 21 + FFmpeg)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Application with Maven
# ------------------------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B -q || true

# Copy source code and build production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime with FFmpeg & Security Hardening
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Install FFmpeg, ffprobe, curl (for healthcheck), and timezone support
RUN apk add --no-cache ffmpeg curl tzdata

# Create non-root system group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy executable jar from builder stage
COPY --from=builder /app/target/app.jar /app/app.jar

# Ensure proper permissions for the application user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Render and container port configuration
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

EXPOSE 8080

# Container healthcheck against Actuator / health endpoint
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=45s \
  CMD curl -f http://localhost:${PORT:-8080}/actuator/health || exit 1

# Launch Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
