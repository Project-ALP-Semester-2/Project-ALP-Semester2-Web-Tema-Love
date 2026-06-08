package com.example.demo.Controller;

import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.Notifikasi; 
import com.example.demo.Model.User;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.FollowRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.NotifikasiRepository; 
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class NavigationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private LikeCeritaRepository likeCeritaRepository; 

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private NotifikasiRepository notifikasiRepository; 

    private void setAtributUser(String userId, Model model) {
        if (userId != null && userId.startsWith("Anon-")) {
            model.addAttribute("userAktif", userId.replace("Anon-", "") + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }
    }

    private void kirimDaftarLike(User user, Model model) {
        List<Long> likedCeritaIds = likeCeritaRepository.findByUserOrderByIdDesc(user)
                .stream().map(like -> like.getCerita().getId()).collect(Collectors.toList());
        model.addAttribute("likedCeritaIds", likedCeritaIds);
    }

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

        Optional<User> userOpt = userRepository.findByUsername(userId);
        if (userOpt.isPresent()) {
            // Tarik semua notifikasi milik user ini
            List<Notifikasi> listNotif = notifikasiRepository.findByPenerimaOrderByWaktuDesc(userOpt.get());
            model.addAttribute("daftarNotifikasi", listNotif);
        }

        return "notifications"; 
    }

    @GetMapping("/bookmarks")
    public String halamanBookmarks(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);

        Optional<User> userOpt = userRepository.findByUsername(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            List<Bookmark> listBookmark = bookmarkRepository.findByUser(user);
            List<Cerita> ceritaBookmarks = listBookmark.stream().map(Bookmark::getCerita).collect(Collectors.toList());
            
            model.addAttribute("daftarBookmark", ceritaBookmarks);

            List<Long> bookmarkedIds = ceritaBookmarks.stream().map(Cerita::getId).collect(Collectors.toList());
            model.addAttribute("bookmarkedIds", bookmarkedIds);

            kirimDaftarLike(user, model);
        }
        
        return "bookmarks"; 
    }
}