// CONFIG DATABASE GITHUB
const GH_TOKEN = "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"; // HATI-HATI: Jangan share file ini!
const REPO = "USERNAME_KAMU/REPO_NAME";
const PATH = "database.json";

let dbData = null;
let currentUser = null;

// Ambil data dari GitHub saat load
async function fetchDB() {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
        headers: { "Authorization": `token ${GH_TOKEN}` }
    });
    const data = await res.json();
    const content = atob(data.content); // Decode Base64
    dbData = JSON.parse(content);
    dbData.sha = data.sha; // Simpan SHA untuk update nanti
}

// Update data ke GitHub
async function updateDB() {
    const updatedContent = btoa(JSON.stringify(dbData, null, 2)); // Encode ke Base64
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
        method: "PUT",
        headers: { 
            "Authorization": `token ${GH_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update Highscore by Game",
            content: updatedContent,
            sha: dbData.sha
        })
    });
    if(res.ok) alert("Data berhasil masuk ke Database GitHub!");
}

// Logika Auth (Login/Daftar Otomatis)
async function handleAuth() {
    await fetchDB();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    
    let user = dbData.users.find(x => x.username === u);
    
    if(user) {
        if(user.password === p) {
            currentUser = user;
            alert("Welcome back, " + u);
            showGame();
        } else { alert("Password salah!"); }
    } else {
        // Daftar baru
        dbData.users.push({ username: u, password: p, highscore: 0 });
        await updateDB();
        alert("Akun baru terdaftar di database!");
    }
}

function showGame() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
}

// Info Pembuat
console.log("Game Created by: Ilman Cahyo sya'bani");