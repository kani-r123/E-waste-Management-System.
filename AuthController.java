package com.trash2tech;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

/*
 * Classroom-only token-shaped demonstration. This is NOT a secure JWT implementation:
 * it does not sign or verify tokens and must not be used in a real application.
 * Use a proper JWT library + Spring Security for a full JWT assignment.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "");
        String password = body.getOrDefault("password", "");
        if (!username.equals("student") || !password.equals("demo123")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid demo credentials");
        }
        String payload = "{\"sub\":\"student\",\"iat\":" + Instant.now().getEpochSecond() + "}";
        String token = Base64.getUrlEncoder().withoutPadding()
            .encodeToString("{\"alg\":\"none\"}".getBytes(StandardCharsets.UTF_8))
            + "." + Base64.getUrlEncoder().withoutPadding()
            .encodeToString(payload.getBytes(StandardCharsets.UTF_8)) + ".";
        return Map.of("token", token, "message", "Demo only; not a signed JWT");
    }
}
