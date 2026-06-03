package com.example.demo.Controller;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.UUID;

@Controller
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 1. MENAMPILKAN HALAMAN WELCOME (Gambar UI yang kamu kirim)
    @GetMapping("/welcome")
    public String halamanWelcome() {
        return "welcome"; // Mengarah ke welcome.html (berisi 3 tombol tersebut)
    }

    // 2. LOGIKA TOMBOL: "BERGABUNG SECARA ANONIM"
    @GetMapping("/auth/anonim")
    public String gabungAnonim(HttpSession session) {
        // Buat objek user baru otomatis
        User anonimUser = new User();
        
        // Generate username acak unik, misal: Anonim-a1b2c3d4
        String kodeAcak = UUID.randomUUID().toString().substring(0, 8);
        anonimUser.setUsername("Anonim-" + kodeAcak);
        
        // Data pelengkap diisi default/kosong
        anonimUser.setEmail("anonim_" + kodeAcak + "@loveapp.com");
        anonimUser.setPassword("RAHASIA_ANONIM"); // Atau bisa di-encrypt kosong
        anonimUser.setRole("ROLE_GUEST");

        // Simpan langsung ke database MySQL tabel users
        User savedUser = userRepository.save(anonimUser);

        // Masukkan data user ke dalam Session HTTP agar aplikasi tahu dia sudah "login"
        session.setAttribute("userLogin", savedUser);

        // Lempar user langsung ke halaman utama daftar cerita
        return "redirect:/cerita/dashboard";
    }

    // 3. MENAMPILKAN HALAMAN SIGN-IN BIASA (Jika klik Sign In di bawah)
    @GetMapping("/login")
    public String halamanLogin() {
        return "login"; // Mengarah ke login.html (form username & password biasa)
    }
}