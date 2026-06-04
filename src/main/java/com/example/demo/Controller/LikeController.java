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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
public class LikeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private LikeCeritaRepository likeCeritaRepository;

    @Autowired
    private NotifikasiRepository notifikasiRepository;

    @PostMapping("/like/toggle")
    public String toggleLike(@RequestParam("ceritaId") Long ceritaId, 
                             @RequestParam("userId") String userId, 
                             @RequestParam("token") Integer token,
                             @RequestParam(value = "redirect", defaultValue = "profile") String redirect) {
        
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";

        Optional<User> userOpt = userRepository.findByUsername(userId);
        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);

        if (userOpt.isPresent() && ceritaOpt.isPresent()) {
            User userPengklik = userOpt.get();
            Cerita cerita = ceritaOpt.get();

            if (likeCeritaRepository.existsByUserAndCerita(userPengklik, cerita)) {
                LikeCerita like = likeCeritaRepository.findByUserAndCerita(userPengklik, cerita);
                likeCeritaRepository.delete(like);
            } else {
                LikeCerita likeBaru = new LikeCerita();
                likeBaru.setUser(userPengklik);
                likeBaru.setCerita(cerita);
                likeCeritaRepository.save(likeBaru);

                if (!userPengklik.getUsername().equals(cerita.getUser().getUsername())) {
                    Notifikasi notif = new Notifikasi();
                    notif.setPenerima(cerita.getUser()); // Pemilik cerita
                    notif.setPengirim(userPengklik); // Yang nge-like
                    notif.setJenis("LIKE");
                    notif.setCerita(cerita);
                    notif.setPesan("memberikan empati pada ceritamu.");
                    notif.setWaktu(LocalDateTime.now());
                    notifikasiRepository.save(notif);
                }
            }
        }
        
        if ("home".equals(redirect)) return "redirect:/homepage?userId=" + userId + "&token=" + token;
        if ("bookmarks".equals(redirect)) return "redirect:/bookmarks?userId=" + userId + "&token=" + token;
        return "redirect:/profile?userId=" + userId + "&token=" + token;
    }
}