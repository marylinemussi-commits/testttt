// Gestion de la page de connexion

document.addEventListener('DOMContentLoaded', () => {
    // Attendre que tous les scripts soient chargés
    setTimeout(() => {
        // S'assurer que les données sont initialisées
        if (typeof initData === 'function') {
            initData();
        } else {
            console.error('initData n\'est pas définie. Vérifiez que data.js est chargé.');
        }
        
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        
        if (!loginForm) {
            console.error('Formulaire de connexion introuvable');
            return;
        }
        
        // Vérifier si l'utilisateur est déjà connecté
        if (typeof getCurrentUser === 'function') {
            const currentUser = getCurrentUser();
            if (currentUser) {
                if (typeof redirectByUserType === 'function') {
                    redirectByUserType();
                }
                return;
            }
        }
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                if (loginMessage) {
                    loginMessage.textContent = 'Veuillez remplir tous les champs';
                    loginMessage.className = 'message error';
                    loginMessage.style.display = 'block';
                }
                return;
            }
            
            if (typeof login !== 'function') {
                console.error('Fonction login non disponible');
                if (loginMessage) {
                    loginMessage.textContent = 'Erreur système. Rechargez la page.';
                    loginMessage.className = 'message error';
                    loginMessage.style.display = 'block';
                }
                return;
            }
            
            const user = login(username, password);
            
            if (user) {
                if (loginMessage) {
                    loginMessage.textContent = 'Connexion réussie, redirection...';
                    loginMessage.className = 'message success';
                    loginMessage.style.display = 'block';
                }
                
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
                if (loginMessage) {
                    loginMessage.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
                    loginMessage.className = 'message error';
                    loginMessage.style.display = 'block';
                }
            }
        });
        
        // Ajouter des gestionnaires d'événements pour les boutons de connexion rapide
        const btnLoginAdmin = document.getElementById('btnLoginAdmin');
        const btnLoginCollege = document.getElementById('btnLoginCollege');
        
        if (btnLoginAdmin) {
            btnLoginAdmin.addEventListener('click', (e) => {
                e.preventDefault();
                quickLogin('admin', 'admin123');
            });
        }
        
        if (btnLoginCollege) {
            btnLoginCollege.addEventListener('click', (e) => {
                e.preventDefault();
                quickLogin('college', 'college123');
            });
        }
    }, 100);
});

// Fonction de connexion rapide
function quickLogin(username, password) {
    console.log('quickLogin appelé avec:', username);
    
    // S'assurer que les données sont initialisées
    if (typeof initData === 'function') {
        initData();
    } else {
        console.error('initData non disponible');
        alert('Erreur: Les données ne sont pas initialisées. Rechargez la page.');
        return;
    }
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    
    if (!usernameInput || !passwordInput) {
        console.error('Champs de formulaire introuvables');
        return;
    }
    
    usernameInput.value = username;
    passwordInput.value = password;
    
    if (typeof login !== 'function') {
        console.error('Fonction login non disponible');
        if (loginMessage) {
            loginMessage.textContent = 'Erreur système. Rechargez la page.';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
        return;
    }
    
    const user = login(username, password);
    console.log('Utilisateur trouvé:', user);
    
    if (user) {
        if (loginMessage) {
            loginMessage.textContent = 'Connexion réussie, redirection...';
            loginMessage.className = 'message success';
            loginMessage.style.display = 'block';
        }
        
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
        console.error('Échec de la connexion');
        if (loginMessage) {
            loginMessage.textContent = 'Erreur de connexion. Vérifiez les identifiants.';
            loginMessage.className = 'message error';
            loginMessage.style.display = 'block';
        }
    }
}

// Rendre la fonction accessible globalement
window.quickLogin = quickLogin;

// Fonction pour accéder directement au dashboard
function goToDashboard(type) {
    console.log('goToDashboard appelé avec type:', type);
    
    if (typeof initData === 'function') {
        initData();
    }
    
    // Vérifier si un utilisateur est déjà connecté
    if (typeof getCurrentUser === 'function') {
        const currentUser = getCurrentUser();
        
        if (currentUser && currentUser.type === type) {
            // L'utilisateur est déjà connecté avec le bon type
            if (type === 'academique') {
                window.location.href = 'dashboard-academique.html';
            } else if (type === 'etablissement') {
                window.location.href = 'dashboard-etablissement.html';
            }
            return;
        }
    }
    
    // Connecter automatiquement avec le compte par défaut
    if (type === 'academique') {
        quickLogin('admin', 'admin123');
    } else if (type === 'etablissement') {
        quickLogin('college', 'college123');
    }
}

window.goToDashboard = goToDashboard;

