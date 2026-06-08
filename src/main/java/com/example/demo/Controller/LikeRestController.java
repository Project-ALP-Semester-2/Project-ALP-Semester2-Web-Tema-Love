package com.example.demo.Controller;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.User;
import com.example.demo.Model.Notifikasi; 
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.NotifikasiRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LikeRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private LikeCeritaRepository likeCeritaRepository;

    @Autowired
    private NotifikasiRepository notifikasiRepository;

    @PostMapping("/like/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @RequestParam("ceritaId") Long ceritaId, 
            @RequestParam("userId") String userId, 
            @RequestParam("token") Integer token) {
        
        Map<String, Object> response = new HashMap<>();

        // 1. Logika Terpenting: Validasi token server bawaan kodemu
        if (token == null || !token.equals(LoginController.tokenServer)) {
            response.put("status", "unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Optional<User> userOpt = userRepository.findByUsername(userId);
        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);

        boolean liked = false;
        int totalLike = 0;

        if (userOpt.isPresent() && ceritaOpt.isPresent()) {
            User userPengklik = userOpt.get();
            Cerita cerita = ceritaOpt.get();

            // 2. Logika Terpenting: Proses Unlike / Like ke Database
            if (likeCeritaRepository.existsByUserAndCerita(userPengklik, cerita)) {
                LikeCerita like = likeCeritaRepository.findByUserAndCerita(userPengklik, cerita);
                likeCeritaRepository.delete(like);
                liked = false; // Status setelah diklik: Unlike
            } else {
                LikeCerita likeBaru = new LikeCerita();
                likeBaru.setUser(userPengklik);
                likeBaru.setCerita(cerita);
                likeCeritaRepository.save(likeBaru);
                liked = true; // Status setelah diklik: Like

                // 3. Logika Terpenting: Simpan Notifikasi
                if (!userPengklik.getUsername().equals(cerita.getUser().getUsername())) {
                    Notifikasi notif = new Notifikasi();
                    notif.setPenerima(cerita.getUser());
                    notif.setPengirim(userPengklik);
                    notif.setJenis("LIKE");
                    notif.setCerita(cerita);
                    notif.setPesan("memberikan empati pada ceritamu.");
                    notif.setWaktu(LocalDateTime.now());
                    notifikasiRepository.save(notif);
                }
            }

            // Ambil total like terbaru dari cerita tersebut untuk dikirim balik ke JS
            // Jika di entity Cerita belum ada getDaftarLike(), silakan hitung manual via repo atau gunakan list aslimu
            if (cerita.getDaftarLike() != null) {
                totalLike = cerita.getDaftarLike().size();
            }
        }

        // Return data dalam format JSON yang bersih
        response.put("status", "success");
        response.put("liked", liked);
        response.put("totalLike", totalLike);
        
        return ResponseEntity.ok(response);
    }
}