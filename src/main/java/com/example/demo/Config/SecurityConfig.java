package com.example.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // PROSES BYPASS: Semua orang (termasuk yang belum login) bebas akses URL ini
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/welcome", "/login", "/auth/anonim").permitAll()
                .requestMatchers("/**").permitAll() // SEMENTARA: Buka semua jalur biar lu bisa liat hasil Bootstrapnya dulu!
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .csrf(csrf -> csrf.disable()); // Matikan CSRF sementara biar gak ngeblok form post

        return http.build();
    }
}