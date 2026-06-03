function handleAnonymous() {
    // Karena saat ini kita fokus ke UI, kita langsung arahkan ke homepage
    window.location.href = "homepage.html";
}

// Fungsi untuk tombol "Lanjutkan dengan Google"
function handleGoogle() {
    // Nanti di sini harus tambhakan logika autentikasi Google beneran (seperti Firebase/OAuth)
    // Untuk sekarang, langsung arahkan ke homepage
    window.location.href = "homepage.html";
}

// Fungsi untuk tombol "Lanjutkan dengan Apple"
function handleApple() {
    window.location.href = "homepage.html";
}

// Fungsi untuk tombol "Sign in" (jika sudah punya akun)
function handleSignIn() {
    window.location.href = "homepage.html";
}