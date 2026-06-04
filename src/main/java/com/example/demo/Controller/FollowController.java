package com.example.demo.Controller;

import com.example.demo.Model.Follow;
import com.example.demo.Model.User;
import com.example.demo.Repository.FollowRepository;
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
public class FollowController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FollowRepository followRepository;

    private void setAtributUser(String userId, Model model) {
        if (userId != null && userId.startsWith("Anon-")) {
            model.addAttribute("userAktif", userId.replace("Anon-", "") + " (Anonim)");
        } else {
            model.addAttribute("userAktif", userId);
        }
    }

    @GetMapping("/follow")
    public String halamanFollow(@RequestParam("userId") String userId, @RequestParam("token") Integer token, Model model) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";
        setAtributUser(userId, model);

        Optional<User> currentUserOpt = userRepository.findByUsername(userId);
        if (currentUserOpt.isPresent()) {
            User currentUser = currentUserOpt.get();

            List<User> listMengikuti = followRepository.findByFollower(currentUser)
                    .stream().map(Follow::getFollowing).collect(Collectors.toList());

            List<User> listPengikut = followRepository.findByFollowing(currentUser)
                    .stream().map(Follow::getFollower).collect(Collectors.toList());
 
            List<User> semuaUser = userRepository.findAll();
            List<User> listDisarankan = semuaUser.stream()
                    .filter(u -> !u.getUsername().equals(currentUser.getUsername())) 
                    .filter(u -> !listMengikuti.contains(u)) 
                    .collect(Collectors.toList());

            model.addAttribute("mengikuti", listMengikuti);
            model.addAttribute("pengikut", listPengikut);
            model.addAttribute("disarankan", listDisarankan);
        }

        return "follow"; 
    }

    @PostMapping("/follow/toggle")
    public String toggleFollow(@RequestParam("userId") String userId, 
                               @RequestParam("targetUser") String targetUser, 
                               @RequestParam("token") Integer token) {
        if (token == null || !token.equals(LoginController.tokenServer)) return "redirect:/auth";

        Optional<User> followerOpt = userRepository.findByUsername(userId);
        Optional<User> followingOpt = userRepository.findByUsername(targetUser);

        if (followerOpt.isPresent() && followingOpt.isPresent()) {
            User follower = followerOpt.get();
            User following = followingOpt.get();

            if (followRepository.existsByFollowerAndFollowing(follower, following)) {
                // Jika sudah follow, maka Unfollow (Hapus dari DB)
                Follow relasi = followRepository.findByFollowerAndFollowing(follower, following);
                followRepository.delete(relasi);
            } else {
                // Jika belum, maka Follow (Simpan ke DB)
                Follow relasiBaru = new Follow();
                relasiBaru.setFollower(follower);
                relasiBaru.setFollowing(following);
                followRepository.save(relasiBaru);
            }
        }
        
        return "redirect:/follow?userId=" + userId + "&token=" + token;
    }
}