package com.example.demo.service;

import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {


    @Autowired
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }



    public boolean validasiLogin(String username, String password) {

        Optional<User> userOptional =
                userRepository.findByUsername(username);


        if(userOptional.isPresent()){

            User user = userOptional.get();

            return user.getPassword().equals(password);

        }

        return false;
    }





    // ===== SIGN UP =====

    public boolean usernameExists(String username){

        return userRepository
                .findByUsername(username)
                .isPresent();

    }



    public User register(User user){

        user.setRole("USER");

        return userRepository.save(user);

    }

}