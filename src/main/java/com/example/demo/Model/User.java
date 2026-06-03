package com.example.demo.Model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;

    // HUBUNGAN: Satu user bisa punya banyak cerita
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Cerita> daftarCerita;

    // HUBUNGAN: Satu user bisa punya banyak komentar
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Komentar> daftarKomentar;

    // HUBUNGAN: Satu user bisa punya banyak rating
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Rating> daftarRating;

    
    // GETTER DAN SETTER
    public Long getId() { return id_user; }
    public void setId(Long id_user) { this.id_user = id_user; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Cerita> getDaftarCerita() { return daftarCerita; }
    public void setDaftarCerita(List<Cerita> daftarCerita) { this.daftarCerita = daftarCerita; }

    public List<Komentar> getDaftarKomentar() { return daftarKomentar; }
    public void setDaftarKomentar(List<Komentar> daftarKomentar) { this.daftarKomentar = daftarKomentar; }

    public List<Rating> getDaftarRating() { return daftarRating; }
    public void setDaftarRating(List<Rating> daftarRating) { this.daftarRating = daftarRating; }
}