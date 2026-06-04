package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;

@Controller
@RequestMapping("/auth")
public class LoginController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public static int tokenServer = 0;
    @GetMapping
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
            tokenServer = (int)(Math.random() * 90000) + 10000;
            return "redirect:/homepage?userId=" + username + "&token=" + tokenServer;
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
            return "signup";
        }

        java.util.Optional<User> userExist = userRepository.findByUsername(username);
        if (userExist.isPresent()) {
            model.addAttribute("pesanError", "Username '" + username + "' sudah digunakan. Pilih username lain!");
            return "signup"; 
        }

        User userBaru = new User();
        userBaru.setUsername(username);
        userBaru.setPassword(password); 

        tokenServer = (int)(Math.random() * 90000) + 10000;

        userRepository.save(userBaru);

        return "redirect:/homepage?userId=" + userBaru.getUsername() + "&token=" + tokenServer;
    }

    @GetMapping("/signup-anonim")
    public String halamanSignUpAnonim() {
        return "signup-anonim";
    }

    @PostMapping("/proses-signup-anonim")
    public String prosesSignUpAnonim(
            @RequestParam("username") String username,
            Model model) {

        if (username.trim().isEmpty()) {
            model.addAttribute("pesanError", "Nama samaran tidak boleh kosong!");
            return "signup-anonim";
        }

        String usernameFinal = "Anon-" + username.trim().replaceAll("\\s+", "");

        java.util.Optional<User> userExist = userRepository.findByUsername(usernameFinal);
        if (userExist.isPresent()) {
            model.addAttribute("pesanError", "Nama samaran '" + username + "' sudah diambil. Cari nama lain!");
            return "signup-anonim";
        }

        User userAnonimBaru = new User();
        userAnonimBaru.setUsername(usernameFinal);
        
        String passwordOtomatis = "passAnon-" + (int)(Math.random() * 90000);
        userAnonimBaru.setPassword(passwordOtomatis);

        userRepository.save(userAnonimBaru);

        this.tokenServer = (int)(Math.random() * 90000) + 10000;

        return "redirect:/homepage?userId=" + usernameFinal + "&token=" + this.tokenServer;
    }
}