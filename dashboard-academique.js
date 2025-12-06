// Dashboard Académique

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les données
    if (typeof initData === 'function') {
        initData();
    }
    
    if (!checkAuth()) return;
    
    currentUser = getCurrentUser();
    
    // Vérifier que l'utilisateur est de type académique
    if (currentUser.type !== 'academique') {
        alert('Accès refusé. Vous devez être connecté en tant qu\'administrateur académique.');
        window.location.href = 'index.html';
        return;
    }
    
    const currentUserElement = document.getElementById('currentUser');
    if (currentUserElement) {
        currentUserElement.textContent = currentUser.fullName || currentUser.username;
    }
    
    loadAllData();
    setupEventListeners();
});

function loadAllData() {
    loadVirements();
    loadUsers();
    loadCards();
    loadBalances();
    loadHistory();
    populateAccountSelects();
}

function setupEventListeners() {
    document.getElementById('createVirementForm').addEventListener('submit', handleCreateVirement);
    document.getElementById('userForm').addEventListener('submit', handleCreateUser);
    document.getElementById('createCardForm').addEventListener('submit', handleCreateCard);
    document.getElementById('addMoneyForm').addEventListener('submit', handleAddMoney);
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    if (sectionId === 'virements') loadVirements();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'cards') loadCards();
    if (sectionId === 'balances') loadBalances();
    if (sectionId === 'history') loadHistory();
}

// Rendre la fonction accessible globalement
window.showSection = showSection;

function populateAccountSelects() {
    const accounts = getAccounts();
    const selects = ['fromAccount', 'toAccount', 'cardAccount', 'moneyAccount'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Sélectionner un compte</option>';
            accounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.id;
                option.textContent = `${account.name} (${account.balance.toFixed(2)} €)`;
                select.appendChild(option);
            });
        }
    });
}

function loadVirements() {
    const virements = getVirements();
    const tbody = document.getElementById('virementsTableBody');
    tbody.innerHTML = '';
    
    virements.forEach(virement => {
        const fromAccount = getAccountById(virement.fromAccountId);
        const toAccount = getAccountById(virement.toAccountId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${virement.id}</td>
            <td>${fromAccount ? fromAccount.name : 'N/A'}</td>
            <td>${toAccount ? toAccount.name : 'N/A'}</td>
            <td>${parseFloat(virement.amount).toFixed(2)} €</td>
            <td>${new Date(virement.date).toLocaleDateString('fr-FR')}</td>
            <td><span class="badge badge-success">${virement.status}</span></td>
            <td><button onclick="deleteVirement(${virement.id})" class="btn-danger">Supprimer</button></td>
        `;
        tbody.appendChild(row);
    });
}

function handleCreateVirement(e) {
    e.preventDefault();
    const fromAccountId = parseInt(document.getElementById('fromAccount').value);
    const toAccountId = parseInt(document.getElementById('toAccount').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const label = document.getElementById('label').value;
    
    if (fromAccountId === toAccountId) {
        showMessage('virementMessage', 'Les comptes émetteur et destinataire doivent être différents', 'error');
        return;
    }
    
    const fromAccount = getAccountById(fromAccountId);
    if (fromAccount.balance < amount) {
        showMessage('virementMessage', 'Solde insuffisant', 'error');
        return;
    }
    
    addVirement({ fromAccountId, toAccountId, amount, label });
    showMessage('virementMessage', 'Virement créé avec succès', 'success');
    document.getElementById('createVirementForm').reset();
    loadVirements();
    loadBalances();
    populateAccountSelects();
}

function deleteVirement(virementId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce virement ?')) {
        const virements = getVirements().filter(v => v.id !== virementId);
        localStorage.setItem('virements', JSON.stringify(virements));
        loadVirements();
    }
}

window.deleteVirement = deleteVirement;

function showCreateUserForm() {
    document.getElementById('createUserForm').style.display = 'block';
}

function hideCreateUserForm() {
    document.getElementById('createUserForm').style.display = 'none';
    document.getElementById('userForm').reset();
}

window.showCreateUserForm = showCreateUserForm;
window.hideCreateUserForm = hideCreateUserForm;

function handleCreateUser(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const type = document.getElementById('userType').value;
    const fullName = document.getElementById('fullName').value;
    
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        showMessage('userMessage', 'Ce nom d\'utilisateur existe déjà', 'error');
        return;
    }
    
    addUser({ username, password, type, fullName });
    
    // Créer un compte pour le nouvel utilisateur
    addAccount({
        userId: users.length + 1,
        name: `Compte ${fullName || username}`,
        balance: 0,
        type: type
    });
    
    showMessage('userMessage', 'Utilisateur créé avec succès', 'success');
    document.getElementById('userForm').reset();
    hideCreateUserForm();
    loadUsers();
    populateAccountSelects();
}

function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td><span class="badge badge-${user.type === 'academique' ? 'primary' : 'secondary'}">${user.type}</span></td>
            <td>${user.fullName || '-'}</td>
            <td><button onclick="deleteUserAccount(${user.id})" class="btn-danger">Supprimer</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteUserAccount(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        deleteUser(userId);
        loadUsers();
    }
}

window.deleteUserAccount = deleteUserAccount;

function handleCreateCard(e) {
    e.preventDefault();
    const accountId = parseInt(document.getElementById('cardAccount').value);
    const type = document.getElementById('cardType').value;
    
    const card = addCard({ accountId, type });
    showMessage('cardMessage', `Carte générée : ${formatCardNumber(card.number)}`, 'success');
    document.getElementById('createCardForm').reset();
    loadCards();
}

function formatCardNumber(number) {
    return number.match(/.{1,4}/g).join(' ');
}

function loadCards() {
    const cards = getCards();
    const tbody = document.getElementById('cardsTableBody');
    tbody.innerHTML = '';
    
    cards.forEach(card => {
        const account = getAccountById(card.accountId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatCardNumber(card.number)}</td>
            <td>${account ? account.name : 'N/A'}</td>
            <td>${card.type === 'debit' ? 'Débit' : 'Crédit'}</td>
            <td>${card.expiryDate}</td>
            <td>${card.cvv}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleAddMoney(e) {
    e.preventDefault();
    const accountId = parseInt(document.getElementById('moneyAccount').value);
    const amount = parseFloat(document.getElementById('moneyAmount').value);
    const reason = document.getElementById('moneyReason').value;
    
    updateAccountBalance(accountId, amount);
    addTransaction({
        accountId,
        type: 'depot',
        amount,
        description: reason || 'Ajout d\'argent'
    });
    
    showMessage('moneyMessage', `${amount.toFixed(2)} € ajoutés avec succès`, 'success');
    document.getElementById('addMoneyForm').reset();
    loadBalances();
    populateAccountSelects();
}

function loadBalances() {
    const accounts = getAccounts();
    const container = document.getElementById('balancesCards');
    container.innerHTML = '';
    
    accounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'balance-card';
        card.innerHTML = `
            <h3>${account.name}</h3>
            <div class="balance-amount">${parseFloat(account.balance).toFixed(2)} €</div>
            <p class="balance-type">Type: ${account.type}</p>
        `;
        container.appendChild(card);
    });
}

function loadHistory() {
    const transactions = getTransactions();
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    
    const accounts = getAccounts();
    const accountSelect = document.getElementById('historyAccountFilter');
    accountSelect.innerHTML = '<option value="">Tous les comptes</option>';
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        accountSelect.appendChild(option);
    });
    
    transactions.forEach(transaction => {
        const account = getAccountById(transaction.accountId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString('fr-FR')}</td>
            <td>${account ? account.name : 'N/A'}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type}</span></td>
            <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${transaction.amount >= 0 ? '+' : ''}${parseFloat(transaction.amount).toFixed(2)} €</td>
            <td>${transaction.description || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterHistory() {
    const accountId = document.getElementById('historyAccountFilter').value;
    const date = document.getElementById('historyDateFilter').value;
    const transactions = getTransactions();
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';
    
    let filtered = transactions;
    if (accountId) {
        filtered = filtered.filter(t => t.accountId === parseInt(accountId));
    }
    if (date) {
        filtered = filtered.filter(t => {
            const tDate = new Date(t.date).toDateString();
            const fDate = new Date(date).toDateString();
            return tDate === fDate;
        });
    }
    
    filtered.forEach(transaction => {
        const account = getAccountById(transaction.accountId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString('fr-FR')}</td>
            <td>${account ? account.name : 'N/A'}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type}</span></td>
            <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${transaction.amount >= 0 ? '+' : ''}${parseFloat(transaction.amount).toFixed(2)} €</td>
            <td>${transaction.description || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

window.filterHistory = filterHistory;

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

