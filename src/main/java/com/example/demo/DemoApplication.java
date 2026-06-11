package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	// 🔥 TAMBAHKAN BEAN INI BIAR SPRING GAK PROTES LAGI
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
