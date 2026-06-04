package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Follow;
import com.example.demo.Model.User;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    // Mencari daftar orang yang saya ikuti
    List<Follow> findByFollower(User follower);
    
    // Mencari daftar orang yang mengikuti saya (Pengikut)
    List<Follow> findByFollowing(User following);
    
    // Mengecek apakah saya sudah follow orang ini
    boolean existsByFollowerAndFollowing(User follower, User following);
    
    // Untuk fitur Unfollow
    Follow findByFollowerAndFollowing(User follower, User following);
}