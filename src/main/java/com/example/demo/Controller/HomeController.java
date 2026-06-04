package com.example.demo.Controller;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/homepage")
public class HomeController {
    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @GetMapping
    public String halamanUtamaApp(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token,
            @RequestParam(value = "page", defaultValue = "0") int page,
            Model model) {
        
        if (token == null || !token.equals(LoginController.tokenServer)) {
            return "redirect:/auth";
        }
        

        if (userId != null && userId.startsWith("Anon-")) {
            String namaTampilan = userId.replace("Anon-", "");
            model.addAttribute("userAktif", namaTampilan + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }

        int ukuranHalaman = 10;
        Pageable pageable = PageRequest.of(page, ukuranHalaman);
        Page<Cerita> halamanCerita = ceritaRepository.findAllCeritaTerbaru(pageable);
        
        for (Cerita cerita : halamanCerita.getContent()) {
            long totalHealthy = ratingRepository.countByCeritaIdAndStatusRating(cerita.getId(), "HEALTHY");
            long totalToxic = ratingRepository.countByCeritaIdAndStatusRating(cerita.getId(), "TOXIC");
            long total = totalHealthy + totalToxic;

            cerita.setTotalVote(total);
            
            int pctH = total > 0 ? (int) Math.round(((double) totalHealthy / total) * 100) : 0;
            int pctT = total > 0 ? (int) Math.round(((double) totalToxic / total) * 100) : 0;
            
            cerita.setPctHealthy(pctH);
            cerita.setPctToxic(pctT);

            if (userId != null) {
                ratingRepository.findByUserUsernameAndCeritaId(userId, cerita.getId())
                        .ifPresent(r -> cerita.setPilihanUserAktif(r.getStatusRating()));
            }
        }
        model.addAttribute("daftarCerita", halamanCerita.getContent());
        
        model.addAttribute("currentPage", page);
        model.addAttribute("hasNext", halamanCerita.hasNext());
        return "homepage";
    }
    
    
    @PostMapping("/cerita/tambah")
    public String tambahCerita(
            @RequestParam("isiCerita") String isiCerita,
            @RequestParam(value = "tag", required = false) String tag,
            @RequestParam(value = "userId", required = false, defaultValue = "A human") String userId,
            @RequestParam(value = "token", required = false) Integer token) {

        if (token == null || !token.equals(com.example.demo.Controller.LoginController.tokenServer)) {
            return "redirect:/auth"; 
        }

        java.util.Optional<User> userPenulisOpt = userRepository.findByUsername(userId);

        // JIKA USER BELUM ADA, BUAT OTOMATIS (Agar tidak error relasi MySQL)
        User userPenulis;
        if (userPenulisOpt.isPresent()) {
            userPenulis = userPenulisOpt.get();
        } else {
            userPenulis = new User();
            userPenulis.setUsername(userId);
            userPenulis.setPassword("rahasia123");
            userPenulis.setRole("USER");
            
            userRepository.save(userPenulis); 
        }

        // Simpan Cerita
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
                // Kita simpan nama aslinya saja di database, urusan tampilan "(Anonim)" biar diatur Thymeleaf
                ceritaBaru.setNamaAnonim(userId); 
            } else {
                ceritaBaru.setNamaAnonim(userPenulis.getUsername());
            }

            ceritaRepository.save(ceritaBaru);
        }

        // 2. PERBAIKAN UTAMA: Kembalikan userId DAN token rahasianya ke homepage agar tidak kena tendang!
        return "redirect:/homepage?userId=" + userId + "&token=" + token;
        }
}