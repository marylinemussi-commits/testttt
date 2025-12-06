// Système d'authentification

function login(username, password) {
    console.log('Fonction login appelée avec:', username);
    
    // S'assurer que les données sont initialisées
    if (typeof initData === 'function') {
        initData();
    }
    
    // Utiliser getUsers() qui gère les erreurs
    let users = [];
    if (typeof getUsers === 'function') {
        users = getUsers();
    } else {
        // Fallback si getUsers n'est pas disponible
        try {
            const usersStr = localStorage.getItem('users') || '[]';
            users = JSON.parse(usersStr);
            if (!Array.isArray(users)) {
                users = [];
            }
        } catch (e) {
            console.error('Erreur lors de la lecture des utilisateurs:', e);
            users = [];
        }
    }
    
    console.log('Utilisateurs trouvés:', users.length);
    
    // Vérifier que users est un tableau
    if (!Array.isArray(users)) {
        console.error('users n\'est pas un tableau:', typeof users, users);
        return null;
    }
    
    // Chercher l'utilisateur
    const user = users.find(u => u && u.username === username && u.password === password);
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
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

