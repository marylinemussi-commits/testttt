// Dashboard Établissement

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    currentUser = getCurrentUser();
    if (currentUser.type !== 'etablissement') {
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('currentUser').textContent = currentUser.fullName || currentUser.username;
    
    loadCollegeData();
    setupEventListeners();
});

function loadCollegeData() {
    loadCollegeBalance();
    loadEmployees();
    loadCollegeHistory();
    populateCollegeSelects();
}

function setupEventListeners() {
    document.getElementById('createVirementForm').addEventListener('submit', handleCreateVirement);
    document.getElementById('employeeForm').addEventListener('submit', handleCreateEmployee);
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
    
    if (sectionId === 'compte') loadCollegeBalance();
    if (sectionId === 'employes') loadEmployees();
    if (sectionId === 'historique') loadCollegeHistory();
}

// Rendre la fonction accessible globalement
window.showSection = showSection;

function loadCollegeBalance() {
    const accounts = getAccounts();
    const collegeAccount = accounts.find(a => a.userId === currentUser.id && a.type === 'etablissement');
    
    if (collegeAccount) {
        document.getElementById('collegeBalance').textContent = `${parseFloat(collegeAccount.balance).toFixed(2)} €`;
    } else {
        document.getElementById('collegeBalance').textContent = '0,00 €';
    }
}

function populateCollegeSelects() {
    const accounts = getAccounts();
    const collegeAccount = accounts.find(a => a.userId === currentUser.id && a.type === 'etablissement');
    
    const collegeSelect = document.getElementById('collegeAccount');
    if (collegeSelect && collegeAccount) {
        collegeSelect.innerHTML = `<option value="${collegeAccount.id}">${collegeAccount.name}</option>`;
    }
    
    const employees = getEmployees();
    const employeeSelect = document.getElementById('employeeAccount');
    if (employeeSelect) {
        employeeSelect.innerHTML = '<option value="">Sélectionner un employé</option>';
        employees.forEach(employee => {
            const account = getAccountById(employee.accountId);
            if (account) {
                const option = document.createElement('option');
                option.value = account.id;
                option.textContent = `${employee.name} (${account.balance.toFixed(2)} €)`;
                employeeSelect.appendChild(option);
            }
        });
    }
}

function handleCreateVirement(e) {
    e.preventDefault();
    const fromAccountId = parseInt(document.getElementById('collegeAccount').value);
    const toAccountId = parseInt(document.getElementById('employeeAccount').value);
    const amount = parseFloat(document.getElementById('amount').value);
    const label = document.getElementById('label').value;
    
    const fromAccount = getAccountById(fromAccountId);
    if (fromAccount.balance < amount) {
        showMessage('virementMessage', 'Solde insuffisant', 'error');
        return;
    }
    
    addVirement({ fromAccountId, toAccountId, amount, label });
    showMessage('virementMessage', 'Virement créé avec succès', 'success');
    document.getElementById('createVirementForm').reset();
    loadCollegeBalance();
    populateCollegeSelects();
    loadCollegeHistory();
}

function performOperation() {
    const accounts = getAccounts();
    const collegeAccount = accounts.find(a => a.userId === currentUser.id && a.type === 'etablissement');
    
    if (!collegeAccount) {
        showMessage('operationMessage', 'Compte du collège introuvable', 'error');
        return;
    }
    
    const type = document.getElementById('operationType').value;
    const amount = parseFloat(document.getElementById('operationAmount').value);
    const desc = document.getElementById('operationDesc').value;
    
    if (type === 'retrait' && collegeAccount.balance < amount) {
        showMessage('operationMessage', 'Solde insuffisant', 'error');
        return;
    }
    
    const operationAmount = type === 'depot' ? amount : -amount;
    updateAccountBalance(collegeAccount.id, operationAmount);
    addTransaction({
        accountId: collegeAccount.id,
        type: type,
        amount: operationAmount,
        description: desc || `Opération ${type}`
    });
    
    showMessage('operationMessage', `Opération ${type} effectuée avec succès`, 'success');
    document.getElementById('operationAmount').value = '';
    document.getElementById('operationDesc').value = '';
    loadCollegeBalance();
    loadCollegeHistory();
}

window.performOperation = performOperation;

function showCreateEmployeeForm() {
    document.getElementById('createEmployeeForm').style.display = 'block';
}

function hideCreateEmployeeForm() {
    document.getElementById('createEmployeeForm').style.display = 'none';
    document.getElementById('employeeForm').reset();
}

window.showCreateEmployeeForm = showCreateEmployeeForm;
window.hideCreateEmployeeForm = hideCreateEmployeeForm;

function handleCreateEmployee(e) {
    e.preventDefault();
    const name = document.getElementById('employeeName').value;
    const poste = document.getElementById('employeePoste').value;
    const email = document.getElementById('employeeEmail').value;
    
    addEmployee({
        userId: currentUser.id,
        name,
        poste,
        email
    });
    
    showMessage('employeeMessage', 'Employé créé avec succès', 'success');
    document.getElementById('employeeForm').reset();
    hideCreateEmployeeForm();
    loadEmployees();
    populateCollegeSelects();
}

function loadEmployees() {
    const employees = getEmployees();
    const collegeEmployees = employees.filter(e => e.userId === currentUser.id);
    const tbody = document.getElementById('employeesTableBody');
    tbody.innerHTML = '';
    
    collegeEmployees.forEach(employee => {
        const account = getAccountById(employee.accountId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.poste || '-'}</td>
            <td>${employee.email || '-'}</td>
            <td>${account ? account.name : 'N/A'}</td>
            <td>${account ? parseFloat(account.balance).toFixed(2) : '0.00'} €</td>
            <td><button onclick="deleteEmployeeAccount(${employee.id})" class="btn-danger">Supprimer</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteEmployeeAccount(employeeId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
        deleteEmployee(employeeId);
        loadEmployees();
        populateCollegeSelects();
    }
}

window.deleteEmployeeAccount = deleteEmployeeAccount;

function loadCollegeHistory() {
    const accounts = getAccounts();
    const collegeAccount = accounts.find(a => a.userId === currentUser.id && a.type === 'etablissement');
    
    if (!collegeAccount) return;
    
    const transactions = getTransactions();
    const collegeTransactions = transactions.filter(t => t.accountId === collegeAccount.id);
    const tbody = document.getElementById('collegeHistoryTableBody');
    tbody.innerHTML = '';
    
    collegeTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString('fr-FR')}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type}</span></td>
            <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${transaction.amount >= 0 ? '+' : ''}${parseFloat(transaction.amount).toFixed(2)} €</td>
            <td>${transaction.description || '-'}</td>
            <td>-</td>
        `;
        tbody.appendChild(row);
    });
}

function filterCollegeHistory() {
    const filter = document.getElementById('historyFilter').value;
    const accounts = getAccounts();
    const collegeAccount = accounts.find(a => a.userId === currentUser.id && a.type === 'etablissement');
    
    if (!collegeAccount) return;
    
    let transactions = getTransactions().filter(t => t.accountId === collegeAccount.id);
    
    if (filter) {
        transactions = transactions.filter(t => t.type === filter);
    }
    
    const tbody = document.getElementById('collegeHistoryTableBody');
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString('fr-FR')}</td>
            <td><span class="badge badge-${transaction.type}">${transaction.type}</span></td>
            <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${transaction.amount >= 0 ? '+' : ''}${parseFloat(transaction.amount).toFixed(2)} €</td>
            <td>${transaction.description || '-'}</td>
            <td>-</td>
        `;
        tbody.appendChild(row);
    });
}

window.filterCollegeHistory = filterCollegeHistory;

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

