package com.example.demo.Controller;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookmark")
public class BookmarkRestController {

    @Autowired private BookmarkRepository bookmarkRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CeritaRepository ceritaRepository;

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @RequestParam("ceritaId") Long ceritaId,
            @RequestParam("userId") String userId,
            @RequestParam("token") Integer token) {

        Map<String, Object> response = new HashMap<>();

        // 1. Validasi Token Keamanan
        if (token == null || !token.equals(LoginController.tokenServer)) {
            response.put("status", "unauthorized");
            response.put("message", "Sesi login tidak valid");
            return ResponseEntity.status(401).body(response);
        }

        Optional<User> userOpt = userRepository.findByUsername(userId);
        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);

        if (userOpt.isPresent() && ceritaOpt.isPresent()) {
            User user = userOpt.get();
            Cerita cerita = ceritaOpt.get();

            boolean isBookmarked;

            // 2. Jika sudah ada di bookmark -> Hapus. Jika belum -> Simpan.
            if (bookmarkRepository.existsByUserAndCerita(user, cerita)) {
                bookmarkRepository.deleteByUserAndCerita(user, cerita);
                isBookmarked = false;
            } else {
                Bookmark bBaru = new Bookmark();
                bBaru.setUser(user);
                bBaru.setCerita(cerita);
                bookmarkRepository.save(bBaru);
                isBookmarked = true;
            }

            response.put("status", "success");
            response.put("bookmarked", isBookmarked);
            return ResponseEntity.ok(response);
        }

        response.put("status", "error");
        response.put("message", "User atau Cerita tidak ditemukan");
        return ResponseEntity.status(404).body(response);
    }
}