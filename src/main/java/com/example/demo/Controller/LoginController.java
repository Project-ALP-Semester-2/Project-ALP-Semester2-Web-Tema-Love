package com.example.demo.Controller;

import com.example.demo.Model.User;
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


    // ======================
    // HALAMAN LOGIN UTAMA
    // ======================
    @GetMapping("/login")
    public String halamanLoginUtama() {
        return "loginpage";
    }


    // ======================
    // HALAMAN SIGN IN
    // ======================
    @GetMapping("/signin")
    public String halamanSignInManual() {
        return "signin";
    }


    // ======================
    // PROSES SIGN IN
    // ======================
    @PostMapping("/proses-signin")
    public String prosesSignIn(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model) {


        boolean isUserValid = userService.validasiLogin(username, password);
        

        if (isUserValid) {

            return "redirect:/homepage";

        } else {

            model.addAttribute(
                "pesanError",
                "Username atau Password salah!"
            );

            return "signin"; 
        }
    }



    // ======================
    // HALAMAN SIGN UP
    // ======================
    @GetMapping("/signup")
    public String halamanSignUp() {

        return "signup";
    }



    // ======================
    // PROSES SIGN UP
    // ======================
    @PostMapping("/proses-signup")
    public String prosesSignUp(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            Model model) {


        // cek username sudah ada
        if(userService.usernameSudahAda(username)){

            model.addAttribute(
                "pesanError",
                "Username sudah digunakan!"
            );

            return "signup";
        }



        User userBaru = new User();

        userBaru.setUsername(username);
        userBaru.setPassword(password);

        // default role
        userBaru.setRole("USER");


        // simpan ke database
        userService.registerUser(userBaru);



        model.addAttribute(
            "pesanBerhasil",
            "Akun berhasil dibuat, silakan login!"
        );


        return "signin";
    }




    // ======================
    // HOMEPAGE
    // ======================
    @GetMapping("/homepage")
    public String halamanUtamaApp(
            @RequestParam(
                value = "userId",
                required = false
            ) String userId,
            Model model) {


        if (userId != null) {

            model.addAttribute(
                "userAktif",
                userId
            );

        } else {

            model.addAttribute(
                "userAktif",
                "User Resmi"
            );
        }


        return "homepage";
    }
}