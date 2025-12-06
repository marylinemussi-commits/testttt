// Système de stockage des données (localStorage)

// Initialiser les données si elles n'existent pas
function initData() {
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, username: 'admin', password: 'admin123', type: 'academique', fullName: 'Administrateur Académique' },
            { id: 2, username: 'college', password: 'college123', type: 'etablissement', fullName: 'Collège NDM' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('accounts')) {
        const defaultAccounts = [
            { id: 1, userId: 1, name: 'Compte Académique Principal', balance: 100000.00, type: 'academique' },
            { id: 2, userId: 2, name: 'Compte Collège NDM', balance: 50000.00, type: 'etablissement' }
        ];
        localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
    }

    if (!localStorage.getItem('virements')) {
        localStorage.setItem('virements', JSON.stringify([]));
    }

    if (!localStorage.getItem('cards')) {
        localStorage.setItem('cards', JSON.stringify([]));
    }

    if (!localStorage.getItem('transactions')) {
        localStorage.setItem('transactions', JSON.stringify([]));
    }

    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify([]));
    }
}

// Gestion des utilisateurs
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function addUser(user) {
    const users = getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    user.id = newId;
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return user;
}

function deleteUser(userId) {
    const users = getUsers().filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
}

// Gestion des comptes
function getAccounts() {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
}

function getAccountById(accountId) {
    return getAccounts().find(a => a.id === parseInt(accountId));
}

function getAccountsByUserId(userId) {
    return getAccounts().filter(a => a.userId === parseInt(userId));
}

function addAccount(account) {
    const accounts = getAccounts();
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    account.id = newId;
    account.balance = account.balance || 0;
    accounts.push(account);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    return account;
}

function updateAccountBalance(accountId, amount) {
    const accounts = getAccounts();
    const account = accounts.find(a => a.id === parseInt(accountId));
    if (account) {
        account.balance = parseFloat(account.balance) + parseFloat(amount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
}

// Gestion des virements
function getVirements() {
    return JSON.parse(localStorage.getItem('virements') || '[]');
}

function addVirement(virement) {
    const virements = getVirements();
    const newId = virements.length > 0 ? Math.max(...virements.map(v => v.id)) + 1 : 1;
    virement.id = newId;
    virement.date = new Date().toISOString();
    virement.status = 'completed';
    virements.push(virement);
    localStorage.setItem('virements', JSON.stringify(virements));
    
    // Mettre à jour les soldes
    updateAccountBalance(virement.fromAccountId, -parseFloat(virement.amount));
    updateAccountBalance(virement.toAccountId, parseFloat(virement.amount));
    
    // Ajouter aux transactions
    addTransaction({
        accountId: virement.fromAccountId,
        type: 'virement',
        amount: -parseFloat(virement.amount),
        description: `Virement vers compte ${virement.toAccountId} - ${virement.label || ''}`
    });
    addTransaction({
        accountId: virement.toAccountId,
        type: 'virement',
        amount: parseFloat(virement.amount),
        description: `Virement depuis compte ${virement.fromAccountId} - ${virement.label || ''}`
    });
    
    return virement;
}

// Gestion des cartes
function getCards() {
    return JSON.parse(localStorage.getItem('cards') || '[]');
}

function addCard(card) {
    const cards = getCards();
    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    card.id = newId;
    card.number = generateCardNumber();
    card.cvv = generateCVV();
    card.expiryDate = generateExpiryDate();
    card.createdAt = new Date().toISOString();
    cards.push(card);
    localStorage.setItem('cards', JSON.stringify(cards));
    return card;
}

function generateCardNumber() {
    return '4' + Array.from({length: 15}, () => Math.floor(Math.random() * 10)).join('');
}

function generateCVV() {
    return Array.from({length: 3}, () => Math.floor(Math.random() * 10)).join('');
}

function generateExpiryDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
}

// Gestion des transactions
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

function addTransaction(transaction) {
    const transactions = getTransactions();
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    transaction.id = newId;
    transaction.date = new Date().toISOString();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    return transaction;
}

// Gestion des employés
function getEmployees() {
    return JSON.parse(localStorage.getItem('employees') || '[]');
}

function addEmployee(employee) {
    const employees = getEmployees();
    const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    employee.id = newId;
    
    // Créer un compte pour l'employé
    const account = addAccount({
        userId: employee.userId || null,
        name: `Compte ${employee.name}`,
        balance: 0,
        type: 'employee',
        employeeId: newId
    });
    employee.accountId = account.id;
    
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
    return employee;
}

function deleteEmployee(employeeId) {
    const employees = getEmployees().filter(e => e.id !== employeeId);
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Initialiser les données au chargement
initData();

