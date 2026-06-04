package com.example.demo.Controller;

import com.example.demo.Repository.CeritaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {
    @Autowired
    private CeritaRepository ceritaRepository;

    @GetMapping("/homepage")
    public String halamanUtamaApp(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token,
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
        
        return "homepage";
    }
}