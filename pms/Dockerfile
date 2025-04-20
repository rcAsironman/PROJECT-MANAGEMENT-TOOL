FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Convert line endings (if downloaded from Windows) and make mvnw executable
RUN apt-get update && apt-get install -y dos2unix \
    && dos2unix mvnw \
    && chmod +x mvnw

# Copy source code AFTER dependencies are cached
COPY src ./src

# Build the Spring Boot JAR using the Maven wrapper
RUN ./mvnw clean package -DskipTests

# Copy the generated JAR to a standard filename
RUN cp target/*.jar app.jar

# Expose the port used by Spring Boot
EXPOSE 8080

# Start the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]