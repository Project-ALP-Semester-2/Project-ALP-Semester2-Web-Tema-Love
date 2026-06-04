package com.example.demo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class NavigationController {

    // Fungsi bantuan agar nama user tetap muncul rapi di sidebar setiap halaman
    private void setAtributUser(String userId, Model model) {
        if (userId != null && userId.startsWith("Anon-")) {
            model.addAttribute("userAktif", userId.replace("Anon-", "") + " (Anonim)");
        } else {
            // Jika userId kosong, beri default "A human" agar tidak error
            model.addAttribute("userAktif", userId != null && !userId.isEmpty() ? userId : "A human");
        }
    }

    // FUNGSI ROUTING DENGAN PARAMETER OPSIONAL (Menghindari Error 400)
    @GetMapping("/explore")
    public String halamanExplore(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token, 
            Model model) {
        setAtributUser(userId, model);
        return "explorepage"; 
    }

    @GetMapping("/notifications")
    public String halamanNotifications(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token, 
            Model model) {
        setAtributUser(userId, model);
        return "notifications"; 
    }

    @GetMapping("/follow")
    public String halamanFollow(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token, 
            Model model) {
        setAtributUser(userId, model);
        return "follow"; 
    }

    @GetMapping("/bookmarks")
    public String halamanBookmarks(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token, 
            Model model) {
        setAtributUser(userId, model);
        return "bookmarks"; 
    }

    @GetMapping("/profile")
    public String halamanProfile(
            @RequestParam(value = "userId", required = false) String userId, 
            @RequestParam(value = "token", required = false) Integer token, 
            Model model) {
        setAtributUser(userId, model);
        return "profile"; 
    }
}