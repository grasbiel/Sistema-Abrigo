package br.com.abrigo.sistema.controller;


import br.com.abrigo.sistema.dto.AuthDto;
import br.com.abrigo.sistema.security.JwtUtil;
import br.com.abrigo.sistema.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    public ResponseEntity<?> login(@RequestBody @Valid AuthDto.LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            final String accessToken = jwtUtil.generateToken(userDetails);
            final String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            
            return ResponseEntity.ok(new AuthDto.LoginResponse(accessToken, refreshToken));

        } catch (BadCredentialsException e) {
            // CORREÇÃO: RETORNA 401 (Unauthorized) para credenciais inválidas, não 403
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody @Valid AuthDto.TokenRefreshRequest request) {
        try {
            String refreshToken = request.refreshToken();
            String username = jwtUtil.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.isTokenValid(refreshToken, userDetails)) {
                String newAccessToken = jwtUtil.generateToken(userDetails);
                return ResponseEntity.ok(new AuthDto.TokenRefreshResponse(newAccessToken, refreshToken));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido ou expirado");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido ou expirado");
    }
}