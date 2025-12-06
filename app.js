// Gestion de la page de connexion

// Initialiser les données au chargement
if (typeof initData === 'function') {
    initData();
}

document.addEventListener('DOMContentLoaded', () => {
    // S'assurer que les données sont initialisées
    if (typeof initData === 'function') {
        initData();
    }
    
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (!loginForm) return;
    
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = getCurrentUser();
    if (currentUser) {
        redirectByUserType();
        return;
    }
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            loginMessage.textContent = 'Veuillez remplir tous les champs';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
            return;
        }
        
        const user = login(username, password);
        
        if (user) {
            loginMessage.textContent = 'Connexion réussie, redirection...';
            loginMessage.className = 'message success';
            loginMessage.style.display = 'block';
            
            // Redirection immédiate
            setTimeout(() => {
                if (user.type === 'academique') {
                    window.location.href = 'dashboard-academique.html';
                } else if (user.type === 'etablissement') {
                    window.location.href = 'dashboard-etablissement.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 300);
        } else {
            loginMessage.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
    });
    
});

// Fonction de connexion rapide
function quickLogin(username, password) {
    if (typeof initData === 'function') {
        initData();
    }
    
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    if (!loginForm || !loginMessage) return;
    
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    
    const user = login(username, password);
    
    if (user) {
        loginMessage.textContent = 'Connexion réussie, redirection...';
        loginMessage.className = 'message success';
        loginMessage.style.display = 'block';
        
        // Redirection immédiate
        setTimeout(() => {
            if (user.type === 'academique') {
                window.location.href = 'dashboard-academique.html';
            } else if (user.type === 'etablissement') {
                window.location.href = 'dashboard-etablissement.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 300);
    } else {
        loginMessage.textContent = 'Erreur de connexion';
        loginMessage.className = 'message error';
        loginMessage.style.display = 'block';
    }
}

// Rendre la fonction accessible globalement
window.quickLogin = quickLogin;

