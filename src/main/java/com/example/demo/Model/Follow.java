package com.example.demo.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "follows", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"follower_id", "following_id"})
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User yang menekan tombol follow (Pengikut)
    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    // User yang diikuti
    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getFollower() { return follower; }
    public void setFollower(User follower) { this.follower = follower; }
    public User getFollowing() { return following; }
    public void setFollowing(User following) { this.following = following; }
}