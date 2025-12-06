// Système d'authentification

function login(username, password) {
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

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Rendre la fonction accessible globalement
window.logout = logout;

function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function redirectByUserType() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    if (user.type === 'academique') {
        if (!window.location.pathname.includes('dashboard-academique.html')) {
            window.location.href = 'dashboard-academique.html';
        }
    } else if (user.type === 'etablissement') {
        if (!window.location.pathname.includes('dashboard-etablissement.html')) {
            window.location.href = 'dashboard-etablissement.html';
        }
    }
}

