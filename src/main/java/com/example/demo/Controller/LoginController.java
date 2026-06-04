package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final User user;
    
    public LoginController(UserService userService, UserRepository userRepository, User user) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.user = user;
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
    
    @GetMapping("/signup")
    public String halamanSignUp() {
        return "signup";
    }

    @PostMapping("/proses-signup")
    public String prosesSignUp(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model) {


        if (username.trim().isEmpty() || password.trim().isEmpty()) {
            model.addAttribute("pesanError", "Username dan Password tidak boleh kosong!");
            return "signuppage"; // Kembali ke halaman pendaftaran dengan pesan error
        }

        java.util.Optional<User> userExist = userRepository.findByUsername(username);
        if (userExist.isPresent()) {
            model.addAttribute("pesanError", "Username '" + username + "' sudah digunakan. Pilih username lain!");
            return "signuppage"; 
        }

        User userBaru = new User();
        userBaru.setUsername(username);
        userBaru.setPassword(password); 


        userRepository.save(userBaru);

        return "redirect:/signin?suksesDaftar=true";
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