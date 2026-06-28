package com.example.demo.dto;

public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String username;
    private String role;
    private String fullName;

    public AuthResponseDto() {}

    public AuthResponseDto(String accessToken, String refreshToken, String username, String role, String fullName) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
        this.role = role;
        this.fullName = fullName;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    // Builder
    public static AuthResponseDtoBuilder builder() {
        return new AuthResponseDtoBuilder();
    }

    public static class AuthResponseDtoBuilder {
        private String accessToken;
        private String refreshToken;
        private String username;
        private String role;
        private String fullName;

        public AuthResponseDtoBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthResponseDtoBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthResponseDtoBuilder username(String username) { this.username = username; return this; }
        public AuthResponseDtoBuilder role(String role) { this.role = role; return this; }
        public AuthResponseDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }

        public AuthResponseDto build() {
            return new AuthResponseDto(accessToken, refreshToken, username, role, fullName);
        }
    }
}
