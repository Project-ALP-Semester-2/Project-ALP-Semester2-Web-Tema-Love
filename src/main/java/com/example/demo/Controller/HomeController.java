package com.example.demo.Controller;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.User;
import com.example.demo.Model.Komentar;
import com.example.demo.Model.Notifikasi; 
import com.example.demo.Model.Follow;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Repository.RatingRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.KomentarRepository;
import com.example.demo.Repository.NotifikasiRepository; 
import com.example.demo.Repository.FollowRepository;
import com.example.demo.Service.AIModerationService;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
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
    @Autowired private FollowRepository followRepository;
    @Autowired private AIModerationService aiModerationService;

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
        List<User> listMengikuti = new java.util.ArrayList<>(); // Untuk menampung daftar user yang diikuti

        if (currentUserOpt.isPresent()) {
            User user = currentUserOpt.get();
            
            List<Long> likedCeritaIds = likeCeritaRepository.findByUserOrderByIdDesc(user)
                    .stream().map(like -> like.getCerita().getId()).collect(Collectors.toList());
            model.addAttribute("likedCeritaIds", likedCeritaIds);
            
            List<Long> bookmarkedIds = bookmarkRepository.findByUser(user)
                    .stream().map(b -> b.getCerita().getId()).collect(Collectors.toList());
            model.addAttribute("bookmarkedIds", bookmarkedIds);

            // Ambil daftar user yang di-follow oleh user aktif saat ini
            listMengikuti = followRepository.findByFollower(user)
                    .stream().map(Follow::getFollowing).collect(Collectors.toList());
        }

        // --- TAB 1: DATA FOR YOU (Semua Cerita Terbaru) ---
        Pageable pageableForYou = PageRequest.of(page, 10);
        Page<Cerita> halamanForYou = ceritaRepository.findAllCeritaTerbaru(pageableForYou);
        List<Cerita> ceritaForYou = halamanForYou.getContent();
        
        model.addAttribute("daftarCerita", ceritaForYou);
        // Kirim status halaman terakhir khusus untuk tab For You
        model.addAttribute("isLastPageForYou", halamanForYou.isLast()); 

        for (Cerita cerita : ceritaForYou) {
            hitungVotingDanPilihanUser(cerita, userId);
        }

        // --- TAB 2: DATA FOLLOWING (Cerita dari User yang kita Follow) ---
        List<Cerita> ceritaFollowing = new java.util.ArrayList<>();
        boolean isLastPageFollowing = true; // Default true jika tidak mem-follow siapapun

        if (!listMengikuti.isEmpty()) {
            // PERBAIKAN: Gunakan Pageable juga untuk query Following agar mendukung pagination per halaman
            Pageable pageableFollowing = PageRequest.of(page, 10);
            
            // Catatan: Pastikan di CeritaRepository kamu sudah membuat method query yang menerima Pageable ini
            Page<Cerita> halamanFollowing = ceritaRepository.findByUserInOrderByTanggalDibuatDesc(listMengikuti, pageableFollowing);
            
            ceritaFollowing = halamanFollowing.getContent();
            isLastPageFollowing = halamanFollowing.isLast();
            
            for (Cerita cerita : ceritaFollowing) {
                hitungVotingDanPilihanUser(cerita, userId);
            }
        }
        
        // Kirim data cerita following ke model
        model.addAttribute("daftarFollowing", ceritaFollowing);
        // Kirim status halaman terakhir khusus untuk tab Following
        model.addAttribute("isLastPageFollowing", isLastPageFollowing);

        // Data global pendukung nomor halaman
        model.addAttribute("currentPage", page);
        model.addAttribute("hasNext", halamanForYou.hasNext());

        return "homepage";
    }

    // Helper method privat di dalam HomeController agar kodenya bersih dan tidak berulang
    private void hitungVotingDanPilihanUser(Cerita cerita, String userId) {
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
    
    @PostMapping("/cerita/tambah")
    public String tambahCerita(
            @RequestParam("isiCerita") String isiCerita,
            @RequestParam(value = "tag", required = false) String tag,
            @RequestParam(value = "userId", required = false, defaultValue = "A human") String userId,
            @RequestParam(value = "token", required = false) Integer token,
            RedirectAttributes redirectAttributes) {

        if (token == null || !token.equals(com.example.demo.Controller.LoginController.tokenServer)) 
            return "redirect:/auth"; 

        // ==========================================================================
        // 🚨 VALIDASI INPUT
        // ==========================================================================
        if (isiCerita == null || isiCerita.trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("errorAI", "Cerita tidak boleh kosong!");
            return "redirect:/homepage?userId=" + userId + "&token=" + token;
        }

        // ==========================================================================
        // 🚨 MODERASI DENGAN HUGGING FACE API
        // ==========================================================================
        System.out.println("\n==================================================");
        System.out.println("🚨 [SYSTEM SENSOR] ADA POSTINGAN CERITA MASUK!");
        System.out.println("👤 User: " + userId);
        System.out.println("📝 Teks Asli: " + (isiCerita.length() > 100 ? isiCerita.substring(0, 100) + "..." : isiCerita));
        
        try {
            // Panggil service moderasi
            boolean isToxic = aiModerationService.isTextToxic(isiCerita);
            
            System.out.println("🔍 Hasil Scan Toxic: " + isToxic);
            System.out.println("==================================================\n");

            if (isToxic) {
                System.out.println("🚫 [BLOKIR] Cerita mengandung kontak toxic! Gagal menyimpan ke database.");
                redirectAttributes.addFlashAttribute("errorAI", 
                    "❌ Gagal upload! Cerita Anda mengandung kata-kata kasar atau melanggar panduan komunitas.\n" +
                    "Mohon periksa kembali cerita Anda.");
                return "redirect:/homepage?userId=" + userId + "&token=" + token;
            }
            
            System.out.println("✅ [LOLOS] Cerita aman, melanjutkan ke proses database.");
            
        } catch (Exception e) {
            System.err.println("⚠️ [ERROR] Gagal memanggil API moderasi: " + e.getMessage());
            // Opsional: Blokir atau izinkan? Saya sarankan blokir untuk keamanan
            redirectAttributes.addFlashAttribute("errorAI", 
                "⚠️ Sistem moderasi sedang sibuk. Silakan coba lagi nanti.");
            return "redirect:/homepage?userId=" + userId + "&token=" + token;
        }

        // ==========================================================================
        // PROSES DATABASE (Hanya jalan jika isToxic == false)
        // ==========================================================================
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

        Cerita ceritaBaru = new Cerita();
        ceritaBaru.setIsiCerita(isiCerita);
        if (tag != null && !tag.trim().isEmpty()) 
            ceritaBaru.setTag(tag.replace("#", "").trim());
        ceritaBaru.setTanggalDibuat(LocalDateTime.now());
        ceritaBaru.setUser(userPenulis);
        ceritaBaru.setNamaAnonim(userId.startsWith("Anon-") ? userId : userPenulis.getUsername());
        ceritaRepository.save(ceritaBaru);
        
        System.out.println("💾 [DATABASE] Cerita berhasil disimpan untuk user: " + userId);
        
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