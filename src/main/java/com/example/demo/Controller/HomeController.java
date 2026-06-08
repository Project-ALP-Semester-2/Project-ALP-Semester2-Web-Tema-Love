package com.example.demo.Controller;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import com.example.demo.Model.Komentar;
import com.example.demo.Model.Notifikasi; 
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.RatingRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.KomentarRepository;
import com.example.demo.Repository.NotifikasiRepository; 
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
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/homepage")
public class HomeController {
    
    @Autowired private CeritaRepository ceritaRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RatingRepository ratingRepository;
    @Autowired private LikeCeritaRepository likeCeritaRepository;
    @Autowired private BookmarkRepository bookmarkRepository;
    @Autowired private KomentarRepository komentarRepository;
    @Autowired private NotifikasiRepository notifikasiRepository; 

    @GetMapping
    public String halamanUtamaApp(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token,
            @RequestParam(value = "page", defaultValue = "0") int page,
            Model model) {
        
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        
        if (userId != null && userId.startsWith("Anon-")) {
            model.addAttribute("userAktif", userId.replace("Anon-", "") + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }

        Optional<User> currentUserOpt = userRepository.findByUsername(userId);
        if (currentUserOpt.isPresent()) {
            User user = currentUserOpt.get();
            
            List<Long> likedCeritaIds = likeCeritaRepository.findByUserOrderByIdDesc(user)
                    .stream().map(like -> like.getCerita().getId()).collect(Collectors.toList());
            model.addAttribute("likedCeritaIds", likedCeritaIds);
            
            List<Long> bookmarkedIds = bookmarkRepository.findByUser(user)
                    .stream().map(b -> b.getCerita().getId()).collect(Collectors.toList());
            model.addAttribute("bookmarkedIds", bookmarkedIds);
        }

        Pageable pageable = PageRequest.of(page, 10);
        Page<Cerita> halamanCerita = ceritaRepository.findAllCeritaTerbaru(pageable);
        
        for (Cerita cerita : halamanCerita.getContent()) {
            long totalHealthy = ratingRepository.countByCeritaIdAndStatusRating(cerita.getId(), "HEALTHY");
            long totalToxic = ratingRepository.countByCeritaIdAndStatusRating(cerita.getId(), "TOXIC");
            long total = totalHealthy + totalToxic;

            cerita.setTotalVote(total);
            cerita.setPctHealthy(total > 0 ? (int) Math.round(((double) totalHealthy / total) * 100) : 0);
            cerita.setPctToxic(total > 0 ? (int) Math.round(((double) totalToxic / total) * 100) : 0);

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

        if (token == null || !token.equals(com.example.demo.Controller.LoginController.tokenServer)) return "redirect:/auth"; 

        Optional<User> userPenulisOpt = userRepository.findByUsername(userId);
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

        if (!isiCerita.trim().isEmpty()) {
            Cerita ceritaBaru = new Cerita();
            ceritaBaru.setIsiCerita(isiCerita);
            if (tag != null && !tag.trim().isEmpty()) ceritaBaru.setTag(tag.replace("#", "").trim());
            ceritaBaru.setTanggalDibuat(LocalDateTime.now());
            ceritaBaru.setUser(userPenulis);
            ceritaBaru.setNamaAnonim(userId.startsWith("Anon-") ? userId : userPenulis.getUsername());
            ceritaRepository.save(ceritaBaru);
        }
        return "redirect:/homepage?userId=" + userId + "&token=" + token;
    }


    @PostMapping("/cerita/komentar")
    public String tambahKomentar(
            @RequestParam("ceritaId") Long ceritaId,
            @RequestParam("userId") String userId,
            @RequestParam("token") Integer token,
            @RequestParam("isiKomentar") String isiKomentar) {
        
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";

        Optional<User> userOpt = userRepository.findByUsername(userId);
        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);

        if (userOpt.isPresent() && ceritaOpt.isPresent() && !isiKomentar.trim().isEmpty()) {
            User pengirim = userOpt.get();
            Cerita cerita = ceritaOpt.get();

            Komentar kBaru = new Komentar();
            kBaru.setIsiKomentar(isiKomentar); 
            kBaru.setUser(pengirim);
            kBaru.setCerita(cerita);
            kBaru.setTanggalKomentar(LocalDateTime.now());
            komentarRepository.save(kBaru);

            if (!pengirim.getUsername().equals(cerita.getUser().getUsername())) {
                Notifikasi notif = new Notifikasi();
                notif.setPenerima(cerita.getUser());
                notif.setPengirim(pengirim);
                notif.setJenis("KOMENTAR");
                notif.setCerita(cerita);

                String cuplikanKomen = isiKomentar.length() > 35 ? isiKomentar.substring(0, 35) + "..." : isiKomentar;
                notif.setPesan("membalas: \"" + cuplikanKomen + "\"");
                
                notif.setWaktu(LocalDateTime.now());
                notifikasiRepository.save(notif);
            }
        }
        
        return "redirect:/homepage?userId=" + userId + "&token=" + token;
    }
}