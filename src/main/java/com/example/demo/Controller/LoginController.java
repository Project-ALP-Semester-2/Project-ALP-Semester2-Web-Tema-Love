package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    // Token sederhana untuk validasi keamanan di HomeController
    public static final Integer tokenServer = 123456;

    // ==========================================
    // 1. BAGIAN MENAMPILKAN HALAMAN HTML
    // ==========================================

    @GetMapping("/auth")
    public String authMenu() {
        return "redirect:/auth/signin"; 
    }

    @GetMapping("/auth/signin")
    public String showSignIn() {
        return "signin";
    }

    @GetMapping("/auth/signup")
    public String showSignUp() {
        return "signup";
    }

    @GetMapping("/auth/signup-anonim")
    public String showSignUpAnonim() {
        return "signup-anonim";
    }

    // ==========================================
    // 2. BAGIAN MEMPROSES DATA KE DATABASE
    // ==========================================

    // Proses Sign In
    @PostMapping("/auth/proses-signin")
    public String prosesSignIn(@RequestParam("username") String username, 
                               @RequestParam("password") String password, 
                               Model model) {
        
        // Cari user langsung (Tanpa Optional)
        User user = userRepository.findByUsername(username);

        // Jika user ketemu dan password cocok
        if (user != null && user.getPassword().equals(password)) {
            return "redirect:/homepage?userId=" + username + "&token=" + tokenServer;
        } else {
            model.addAttribute("pesanError", "Username atau password salah!");
            return "signin";
        }
    }

    // Proses Sign Up Biasa
    @PostMapping("/auth/proses-signup")
    public String prosesSignUp(@RequestParam("username") String username, 
                               @RequestParam("password") String password, 
                               Model model) {
        
        // Cek apakah username sudah ada (Tanpa Optional)
        User userExist = userRepository.findByUsername(username);

        if (userExist != null) {
            model.addAttribute("pesanError", "Username sudah terpakai, silakan pilih yang lain.");
            return "signup";
        }

        // Buat user baru
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setRole("USER");
        userRepository.save(newUser);

        return "redirect:/homepage?userId=" + username + "&token=" + tokenServer;
    }

    // Proses Sign Up Anonim
    @PostMapping("/auth/proses-signup-anonim")
    public String prosesSignUpAnonim(@RequestParam("username") String username, 
                                     Model model) {
        
        String usernameFinal = "Anon-" + username.trim();
        
        // Cek apakah username anonim sudah ada (Tanpa Optional)
        User userExist = userRepository.findByUsername(usernameFinal);

        if (userExist != null) {
            model.addAttribute("pesanError", "Nama samaran sudah dipakai orang lain.");
            return "signup-anonim";
        }

        // Buat user anonim baru
        User newAnonUser = new User();
        newAnonUser.setUsername(usernameFinal);
        newAnonUser.setPassword("rahasia123"); // Password otomatis, user anonim tidak butuh pass
        newAnonUser.setRole("ANONIM");
        userRepository.save(newAnonUser);

        return "redirect:/homepage?userId=" + usernameFinal + "&token=" + tokenServer;
    }
}