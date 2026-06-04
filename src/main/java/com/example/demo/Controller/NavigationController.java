package com.example.demo.Controller;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
public class NavigationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    // Fungsi bantuan agar nama user tetap muncul rapi di sidebar setiap halaman
    private void setAtributUser(String userId, Model model) {
        if (userId != null && userId.startsWith("Anon-")) {
            model.addAttribute("userAktif", userId.replace("Anon-", "") + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }
    }

    // FUNGSI ROUTING UNTUK SEMUA MENU NAVBAR
    @GetMapping("/explore")
    public String halamanExplore(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);
        return "explorepage"; 
    }

    @GetMapping("/notifications")
    public String halamanNotifications(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);
        return "notifications"; 
    }

    @GetMapping("/follow")
    public String halamanFollow(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);
        return "follow"; 
    }

    @GetMapping("/bookmarks")
    public String halamanBookmarks(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);
        return "bookmarks"; 
    }

    @GetMapping("/profile")
    public String halamanProfile(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        
        setAtributUser(userId, model);

        Optional<User> userOpt = userRepository.findByUsername(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<Cerita> ceritaKu = ceritaRepository.findByUserOrderByTanggalDibuatDesc(user);
            
            model.addAttribute("daftarCeritaKu", ceritaKu);
            model.addAttribute("jumlahPostingan", ceritaKu.size());
            model.addAttribute("usernameAsli", userId);
        }

        return "profile"; 
    }

    // FUNGSI BARU: HAPUS POSTINGAN
    @PostMapping("/profile/cerita/hapus")
    public String hapusCerita(@RequestParam("ceritaId") Long ceritaId, 
                              @RequestParam("userId") String userId, 
                              @RequestParam("token") Integer token) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";

        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);
        if (ceritaOpt.isPresent()) {
            Cerita cerita = ceritaOpt.get();
            
            // Keamanan tambahan: Pastikan yang menghapus adalah pemilik ceritanya
            if (cerita.getUser().getUsername().equals(userId)) {
                ceritaRepository.delete(cerita);
            }
        }

        // Kembali ke halaman profile setelah sukses menghapus
        return "redirect:/profile?userId=" + userId + "&token=" + token;
    }
}