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

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class HomeController {
    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private UserRepository userRepository; // Pastikan ini ditambahkan

    @GetMapping("/homepage")
    public String halamanUtamaApp(
            @RequestParam(value = "userId", required = false, defaultValue = "A human") String userId, 
            Model model) {
        
        // Atur nama tampilan
        if (userId.startsWith("Anon-")) {
            String namaTampilan = userId.replace("Anon-", "");
            model.addAttribute("userAktif", namaTampilan + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }

        // Tampilkan data ke HTML
        List<Cerita> daftarCerita = ceritaRepository.findAllByOrderByTanggalDibuatDesc();
        model.addAttribute("daftarCerita", daftarCerita);
        
        return "homepage";
    }

    @PostMapping("/cerita/tambah")
    public String tambahCerita(
            @RequestParam("isiCerita") String isiCerita,
            @RequestParam(value = "tag", required = false) String tag,
            @RequestParam(value = "userId", required = false, defaultValue = "A human") String userId) {

        // 1. Cari user di database
        User userPenulis = userRepository.findByUsername(userId);

        // 2. JIKA USER BELUM ADA, BUAT OTOMATIS (Agar tidak error relasi MySQL)
        if (userPenulis == null) {
            userPenulis = new User();
            userPenulis.setUsername(userId);
            userPenulis.setPassword("rahasia123");
            userPenulis.setRole("USER");
            userRepository.save(userPenulis); // Simpan user baru ke database
        }

        // 3. Simpan Cerita
        if (!isiCerita.trim().isEmpty()) {
            Cerita ceritaBaru = new Cerita();
            ceritaBaru.setIsiCerita(isiCerita);
            
            // Simpan tag jika ada (buang simbol # agar bersih di database)
            if (tag != null && !tag.trim().isEmpty()) {
                ceritaBaru.setTag(tag.replace("#", "").trim());
            }

            ceritaBaru.setTanggalDibuat(LocalDateTime.now());
            ceritaBaru.setUser(userPenulis);

            // Tentukan nama yang akan muncul di feed
            if (userId.startsWith("Anon-")) {
                ceritaBaru.setNamaAnonim(userId.replace("Anon-", "") + " (Anonim)");
            } else {
                ceritaBaru.setNamaAnonim(userPenulis.getUsername());
            }

            ceritaRepository.save(ceritaBaru);
        }

        // Redirect kembali ke homepage
        return "redirect:/homepage?userId=" + userId;
    }
}