// ========== STATE ==========
let transactions = JSON.parse(localStorage.getItem('financeTracker')) || [];
let currentType = 'income';
let currentFilter = 'all';

const categories = {
    income: [
        { value: 'salary', label: '💼 Заплата', icon: '💼' },
        { value: 'freelance', label: '💻 Фрийланс', icon: '💻' },
        { value: 'investment', label: '📈 Инвестиции', icon: '📈' },
        { value: 'gift', label: '🎁 Подарък', icon: '🎁' },
        { value: 'other_income', label: '📌 Друго', icon: '📌' }
    ],
    expense: [
        { value: 'food', label: '🍔 Храна', icon: '🍔' },
        { value: 'transport', label: '🚗 Транспорт', icon: '🚗' },
        { value: 'rent', label: '🏠 Наем', icon: '🏠' },
        { value: 'utilities', label: '⚡ Сметки', icon: '⚡' },
        { value: 'entertainment', label: '🎮 Забавления', icon: '🎮' },
        { value: 'shopping', label: '🛍️ Пазаруване', icon: '🛍️' },
        { value: 'health', label: '💊 Здраве', icon: '💊' },
        { value: 'other_expense', label: '📌 Друго', icon: '📌' }
    ]
};

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Finance Tracker loaded!');

    // Set today's date
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    // Load categories for default type (income)
    updateCategoryOptions();

    // Render everything
    renderAll();
});

// ========== FUNCTIONS ==========
function setType(type) {
    currentType = type;

    // Update button styles
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector('.type-btn.' + type);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Update category dropdown
    updateCategoryOptions();
}

function updateCategoryOptions() {
    const select = document.getElementById('category');
    if (!select) {
        console.error('Category select not found!');
        return;
    }

    // Clear existing options except the first one
    select.innerHTML = '<option value="">Избери...</option>';

    // Get categories for current type
    const cats = categories[currentType];
    if (!cats) {
        console.error('No categories found for type:', currentType);
        return;
    }

    // Add options
    cats.forEach(function(cat) {
        const option = document.createElement('option');
        option.value = cat.value;
        option.textContent = cat.label;
        select.appendChild(option);
    });

    console.log('Categories loaded for', currentType, ':', cats.length, 'options');
}

function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    if (!description || !amount || !category || !date) {
        showToast('Моля, попълни всички полета!', 'error');
        return;
    }

    const catData = categories[currentType].find(function(c) { return c.value === category; });

    const transaction = {
        id: Date.now(),
        type: currentType,
        description: description,
        amount: amount,
        category: category,
        categoryLabel: catData.label,
        categoryIcon: catData.icon,
        date: date
    };

    transactions.unshift(transaction);
    saveTransactions();
    renderAll();

    // Reset form
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = '';
    document.getElementById('date').valueAsDate = new Date();

    showToast('Транзакцията е добавена успешно!', 'success');
}

function deleteTransaction(id) {
    transactions = transactions.filter(function(t) { return t.id !== id; });
    saveTransactions();
    renderAll();
    showToast('Транзакцията е изтрита!', 'success');
}

function filterTransactions(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
    renderTransactions();
}

function saveTransactions() {
    localStorage.setItem('financeTracker', JSON.stringify(transactions));
}

// ========== RENDER ==========
function renderAll() {
    renderSummary();
    renderTransactions();
    renderChart();
}

function renderSummary() {
    const income = transactions
        .filter(function(t) { return t.type === 'income'; })
        .reduce(function(sum, t) { return sum + t.amount; }, 0);

    const expense = transactions
        .filter(function(t) { return t.type === 'expense'; })
        .reduce(function(sum, t) { return sum + t.amount; }, 0);

    const balance = income - expense;

    document.getElementById('totalIncome').textContent = formatMoney(income);
    document.getElementById('totalExpense').textContent = formatMoney(expense);
    document.getElementById('balance').textContent = formatMoney(balance);
}

function renderTransactions() {
    const list = document.getElementById('transactionsList');

    let filtered = transactions;
    if (currentFilter !== 'all') {
        filtered = transactions.filter(function(t) { return t.type === currentFilter; });
    }

    if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><p>Няма транзакции в тази категория</p></div>';
        return;
    }

    list.innerHTML = filtered.map(function(t) {
        return '<div class="transaction-item">' +
            '<div class="transaction-info">' +
                '<div class="transaction-icon ' + t.type + '">' + t.categoryIcon + '</div>' +
                '<div class="transaction-details">' +
                    '<h4>' + escapeHtml(t.description) + '</h4>' +
                    '<span>' + t.categoryLabel + ' • ' + formatDate(t.date) + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="display: flex; align-items: center;">' +
                '<div class="transaction-amount ' + t.type + '">' +
                    (t.type === 'income' ? '+' : '-') + formatMoney(t.amount) +
                '</div>' +
                '<button class="delete-btn" onclick="deleteTransaction(' + t.id + ')" title="Изтрий">🗑️</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderChart() {
    const container = document.getElementById('chartContainer');

    if (transactions.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-state-icon">📊</div><p>Няма достатъчно данни за графика</p></div>';
        return;
    }

    const income = transactions.filter(function(t) { return t.type === 'income'; }).reduce(function(s, t) { return s + t.amount; }, 0);
    const expense = transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(s, t) { return s + t.amount; }, 0);
    const balance = income - expense;

    const maxVal = Math.max(income, expense, Math.abs(balance), 1);
    const incomeH = (income / maxVal) * 180;
    const expenseH = (expense / maxVal) * 180;
    const balanceH = (Math.abs(balance) / maxVal) * 180;

    container.innerHTML = 
        '<div class="chart-bar-wrapper">' +
            '<div class="chart-value">' + formatMoney(income) + '</div>' +
            '<div class="chart-bar income" style="height: ' + incomeH + 'px;"></div>' +
            '<div class="chart-label">Приходи</div>' +
        '</div>' +
        '<div class="chart-bar-wrapper">' +
            '<div class="chart-value">' + formatMoney(expense) + '</div>' +
            '<div class="chart-bar expense" style="height: ' + expenseH + 'px;"></div>' +
            '<div class="chart-label">Разходи</div>' +
        '</div>' +
        '<div class="chart-bar-wrapper">' +
            '<div class="chart-value">' + formatMoney(balance) + '</div>' +
            '<div class="chart-bar balance" style="height: ' + balanceH + 'px;"></div>' +
            '<div class="chart-label">Баланс</div>' +
        '</div>';
}

// ========== HELPERS ==========
function formatMoney(amount) {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' лв.';
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type) {
    type = type || 'success';
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';

    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}
const incomes = [];
const expenses = [];
const incomeForm =
document.getElementById("incomeForm");

const totalIncome =
document.getElementById("totalIncome");

const totalExpenses =
document.getElementById("totalExpenses");

const currentBalance =
document.getElementById("currentBalance");
incomeForm.addEventListener(
    "submit",
    addIncome
);

function addIncome(event) {

    event.preventDefault();

    const name =
    document.getElementById("incomeName").value;

    const amount =
    Number(
        document.getElementById("incomeAmount").value
    );

    if(name === "" || amount <= 0){
        return;
    }

    incomes.push({
        name,
        amount
    });

    updateFinance();

    incomeForm.reset();
}
function updateFinance() {

    const incomeTotal =
        incomes.reduce(
            (sum, income) =>
            sum + income.amount,
            0
        );

    const expenseTotal =
        expenses.reduce(
            (sum, expense) =>
            sum + expense.amount,
            0
        );

    const balance =
        incomeTotal - expenseTotal;

    totalIncome.textContent =
        incomeTotal.toFixed(2) + " лв.";

    totalExpenses.textContent =
        expenseTotal.toFixed(2) + " лв.";

    currentBalance.textContent =
        balance.toFixed(2) + " лв.";
}
updateFinance();