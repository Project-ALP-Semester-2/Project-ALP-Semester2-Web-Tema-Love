package com.example.demo.Controller;

import com.example.demo.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    private final UserService userService;
    
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String halamanLoginUtama() {
        return "loginpage";
    }

    @GetMapping("/signin")
    public String halamanSignInManual() {
        return "signin";
    }

    @PostMapping("/proses-signin")
    public String prosesSignIn(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model) {

        // VALIDASI DATABASE
        boolean isUserValid = userService.validasiLogin(username, password);
        
        if (isUserValid) {
            return "redirect:/homepage";
        } else {
            model.addAttribute("pesanError", "Username atau Password salah!");
            return "signin"; 
        }
    }
    

    @GetMapping("/homepage")
    public String halamanUtamaApp(@RequestParam(value = "userId", required = false) String userId, Model model) {
        // Jika masuk lewat jalur anonim, kita tangkap ID anonimnya dari URL parameter
        if (userId != null) {
            model.addAttribute("userAktif", userId);
        } else {
            model.addAttribute("userAktif", "User Resmi");
        }
        
        return "homepage"; // Membuka templates/homepage.html (Pastikan kamu sudah membuat file html ini)
    }
}