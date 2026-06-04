package com.example.demo.Service;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean validasiLogin(String username, String password) {
        // Langsung panggil User tanpa Optional
        User user = userRepository.findByUsername(username);

        // Cek apakah user ketemu di database dan passwordnya cocok
        if (user != null) {
            return user.getPassword().equals(password);
        }
        
        return false;
    }
}