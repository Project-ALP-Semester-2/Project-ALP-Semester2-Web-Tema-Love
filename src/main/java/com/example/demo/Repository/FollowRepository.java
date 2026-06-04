package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Follow;
import com.example.demo.Model.User;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollower(User follower);

    List<Follow> findByFollowing(User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    Follow findByFollowerAndFollowing(User follower, User following);
}