package br.com.abrigo.sistema.controller;

import br.com.abrigo.sistema.dto.AuthDTO;
import br.com.abrigo.sistema.security.JwtUtil;
// ... (imports)
import br.com.abrigo.sistema.service.CustomUserDetailsService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthDTO.LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
            final String accessToken = jwtUtil.generateToken(userDetails);
            final String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            return ResponseEntity.ok(new AuthDTO.LoginResponse(accessToken, refreshToken));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciais inválidas");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody @Valid AuthDTO.TokenRefreshRequest request) {
        try {
            String refreshToken = request.refreshToken();
            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.isTokenValid(refreshToken, userDetails)) {
                String newAccessToken = jwtUtil.generateToken(userDetails);
                // Opcional: rotacionar o refresh token também
                // String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
                return ResponseEntity.ok(new AuthDTO.TokenRefreshResponse(newAccessToken, refreshToken));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Refresh token inválido ou expirado");
        }
        return ResponseEntity.status(401).body("Refresh token inválido ou expirado");
    }
}