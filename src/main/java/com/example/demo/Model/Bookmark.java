package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookmarks")
public class Bookmark {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bookmark") 
    private Long id; 

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "cerita_id")
    private Cerita cerita;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Cerita getCerita() { return cerita; }
    public void setCerita(Cerita cerita) { this.cerita = cerita; }
}