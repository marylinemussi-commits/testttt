// Système d'authentification

function login(username, password) {
    // S'assurer que les données sont initialisées
    if (typeof initData === 'function') {
        initData();
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Rendre les fonctions accessibles globalement
window.login = login;
window.getCurrentUser = getCurrentUser;

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Rendre la fonction accessible globalement
window.logout = logout;

function checkAuth() {
    // S'assurer que les données sont initialisées
    if (typeof initData === 'function') {
        initData();
    }
    
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Rendre la fonction accessible globalement
window.checkAuth = checkAuth;

function redirectByUserType() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const currentPage = window.location.pathname.split('/').pop() || window.location.href.split('/').pop();
    
    if (user.type === 'academique') {
        if (currentPage !== 'dashboard-academique.html' && !currentPage.includes('dashboard-academique')) {
            window.location.href = 'dashboard-academique.html';
        }
    } else if (user.type === 'etablissement') {
        if (currentPage !== 'dashboard-etablissement.html' && !currentPage.includes('dashboard-etablissement')) {
            window.location.href = 'dashboard-etablissement.html';
        }
    } else {
        // Type inconnu, rediriger vers la page de connexion
        window.location.href = 'index.html';
    }
}

// Rendre la fonction accessible globalement
window.redirectByUserType = redirectByUserType;

