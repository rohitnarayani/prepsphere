package com.prepsphere.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Apply CORS configuration to all endpoints starting with /api/
                registry.addMapping("/api/**")
                        // Allow requests only from Vite's default dev server port
                        .allowedOrigins("http://localhost:5173", "https://prepsphere-omega.vercel.app")
                        // Allow common HTTP methods
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        // Allow all request headers
                        .allowedHeaders("*")
                        // Allow cookies or credentials if needed in the future
                        .allowCredentials(true);
            }
        };
    }
}