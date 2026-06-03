package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "rating", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "cerita_id"}) // Mencegah duplikasi di database
})

public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_rating;

    private String statusRating;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    
    @ManyToOne
    @JoinColumn(name = "cerita_id", nullable = false)
    private Cerita cerita;
    
    public Long getId() { return id_rating; }
    public void setId(Long id_rating) { this.id_rating = id_rating; }   

    public String getStatusRating() { return statusRating; }
    public void setStatusRating(String statusRating) { this.statusRating = statusRating; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Cerita getCerita() { return cerita; }
    public void setCerita(Cerita cerita) { this.cerita = cerita; }
}
