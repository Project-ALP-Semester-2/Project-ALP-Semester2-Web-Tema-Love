function handleAnonymous() {
    /* Karena saat ini kita fokus ke UI, kita langsung arahkan ke homepage */
    window.location.href = "homepage.html";
}


function handleGoogle() {
    alert('Fitur login dengan Google belum tersedia. Silakan coba metode lain.');
}
function handleApple() {
    alert('Fitur login dengan Apple belum tersedia. Silakan coba metode lain.');
}

/* Fungsi untuk tombol "Sign in" (jika sudah punya akun) */
function handleSignIn() {
    window.location.href = "homepage.html";
}