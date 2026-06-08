package com.example.demo.Controller;
import com.example.demo.Model.Bookmark;
import com.example.demo.Model.Cerita;
import com.example.demo.Model.LikeCerita;
import com.example.demo.Model.User;
import com.example.demo.Repository.BookmarkRepository;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.FollowRepository;
import com.example.demo.Repository.LikeCeritaRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Controller
@RequestMapping("/profile")
public class ProfilePageController {
    @Autowired private UserRepository userRepository;
    @Autowired private CeritaRepository ceritaRepository;
    @Autowired private FollowRepository followRepository;
    @Autowired private LikeCeritaRepository likeCeritaRepository;
    @Autowired private BookmarkRepository bookmarkRepository;
    
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

    @GetMapping
    public String halamanProfile(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        
        setAtributUser(userId, model);

        Optional<User> userOpt = userRepository.findByUsername(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            List<Cerita> ceritaKu = ceritaRepository.findByUserOrderByTanggalDibuatDesc(user);
            
            List<LikeCerita> listLike = likeCeritaRepository.findByUserOrderByIdDesc(user);
            List<Cerita> ceritaDisukai = listLike.stream().map(LikeCerita::getCerita).collect(Collectors.toList());
            
            int jumlahMengikuti = followRepository.findByFollower(user).size();
            int jumlahPengikut = followRepository.findByFollowing(user).size();
            
            List<Long> bookmarkedIds = bookmarkRepository.findByUser(user)
                    .stream().map(b -> b.getCerita().getId()).collect(Collectors.toList());
            model.addAttribute("bookmarkedIds", bookmarkedIds);

            model.addAttribute("daftarCeritaKu", ceritaKu);
            model.addAttribute("daftarCeritaDisukai", ceritaDisukai); 
            model.addAttribute("jumlahPostingan", ceritaKu.size());
            model.addAttribute("usernameAsli", userId);
            model.addAttribute("jumlahMengikuti", jumlahMengikuti);
            model.addAttribute("jumlahPengikut", jumlahPengikut);
            
            kirimDaftarLike(user, model);
        }

        return "profile"; 
    }

    @PostMapping("/profile/cerita/hapus")
    public String hapusCerita(@RequestParam("ceritaId") Long ceritaId, 
                              @RequestParam("userId") String userId, 
                              @RequestParam("token") Integer token) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";

        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);
        if (ceritaOpt.isPresent()) {
            Cerita cerita = ceritaOpt.get();
            if (cerita.getUser().getUsername().equals(userId)) {
                ceritaRepository.delete(cerita);
            }
        }
        return "redirect:/profile?userId=" + userId + "&token=" + token;
    }

}