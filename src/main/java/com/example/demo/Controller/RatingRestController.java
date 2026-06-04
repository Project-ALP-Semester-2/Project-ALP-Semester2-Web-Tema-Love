package com.example.demo.Controller;

import com.example.demo.Model.Cerita;
import com.example.demo.Model.Rating;
import com.example.demo.Model.User;
import com.example.demo.Repository.CeritaRepository;
import com.example.demo.Repository.RatingRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/rating")
public class RatingRestController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private CeritaRepository ceritaRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/vote")
    public Map<String, Object> simpanVote(
            @RequestParam("ceritaId") Long ceritaId,
            @RequestParam("username") String username,
            @RequestParam("pilihan") String pilihan, 
            @RequestParam("token") Integer token) {

        Map<String, Object> response = new HashMap<>();


        if (token == null || !token.equals(LoginController.tokenServer)) {
            response.put("status", "error");
            response.put("message", "Sesi tidak valid!");
            return response;
        }


        Optional<Cerita> ceritaOpt = ceritaRepository.findById(ceritaId);
        if (!ceritaOpt.isPresent()) {
            response.put("status", "error");
            response.put("message", "Cerita tidak ditemukan!");
            return response;
        }
        Cerita cerita = ceritaOpt.get();


        Optional<User> userOpt = userRepository.findByUsername(username);
        User userPevote;
        if (userOpt.isPresent()) {
            userPevote = userOpt.get();
        } else {
            userPevote = new User();
            userPevote.setUsername(username);
            userPevote.setPassword("rahasia123");
            userPevote.setRole("USER");
            userRepository.save(userPevote);
        }


        Optional<Rating> ratingOpt = ratingRepository.findByUserUsernameAndCeritaId(username, ceritaId);
        Rating rating;
        
        if (ratingOpt.isPresent()) {
            rating = ratingOpt.get();
            rating.setStatusRating(pilihan.toUpperCase());
        } else {
            rating = new Rating();
            rating.setUser(userPevote);
            rating.setCerita(cerita);
            rating.setStatusRating(pilihan.toUpperCase());
        }
        ratingRepository.save(rating);


        long totalHealthy = ratingRepository.countByCeritaIdAndStatusRating(ceritaId, "HEALTHY");
        long totalToxic = ratingRepository.countByCeritaIdAndStatusRating(ceritaId, "TOXIC");
        long totalVote = totalHealthy + totalToxic;

        int pctHealthy = totalVote > 0 ? (int) Math.round(((double) totalHealthy / totalVote) * 100) : 0;
        int pctToxic = totalVote > 0 ? (int) Math.round(((double) totalToxic / totalVote) * 100) : 0;

        response.put("status", "success");
        response.put("pctHealthy", pctHealthy);
        response.put("pctToxic", pctToxic);
        response.put("totalVote", totalVote);

        return response;
    }
}