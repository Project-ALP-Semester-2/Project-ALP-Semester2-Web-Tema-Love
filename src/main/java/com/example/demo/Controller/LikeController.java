package com.example.demo.Controller;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.User;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
public class LikeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private LikeCeritaRepository likeCeritaRepository;

    @PostMapping("/like/toggle")
    public String toggleLike(@RequestParam("ceritaId") Long ceritaId, 
                             @RequestParam("userId") String userId, 
                             @RequestParam("token") Integer token,
                             @RequestParam(value = "redirect", defaultValue = "profile") String redirect) {
        
        System.out.println("=== TOMBOL LIKE DITEKAN ===");
        System.out.println("User yg klik: " + userId);
        System.out.println("ID Cerita: " + ceritaId);

        if (token == null || !token.equals(LoginController.tokenServer)) {
            System.out.println("Token gagal!");
            return "redirect:/auth";
        }

        Optional<User> userOpt = userRepository.findByUsername(userId);
        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);

        if (userOpt.isPresent() && ceritaOpt.isPresent()) {
            User user = userOpt.get();
            Cerita cerita = ceritaOpt.get();

            if (likeCeritaRepository.existsByUserAndCerita(user, cerita)) {
                System.out.println("Status: UNLIKE (Menghapus Like dari Database)");
                LikeCerita like = likeCeritaRepository.findByUserAndCerita(user, cerita);
                likeCeritaRepository.delete(like);
            } else {
                System.out.println("Status: LIKE (Menyimpan Like ke Database)");
                LikeCerita likeBaru = new LikeCerita();
                likeBaru.setUser(user);
                likeBaru.setCerita(cerita);
                likeCeritaRepository.save(likeBaru);
                System.out.println("Sukses menyimpan ke MySQL!");
            }
        } else {
            System.out.println("ERROR: User atau Cerita tidak ditemukan di Database!");
        }
        
        if ("home".equals(redirect)) {
            return "redirect:/homepage?userId=" + userId + "&token=" + token;
        }
        
        return "redirect:/profile?userId=" + userId + "&token=" + token;
    }
}