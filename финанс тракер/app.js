const EUR_RATE = 1.95583;

const incomes = [];
const expenses = [];

const incomeForm = document.getElementById("incomeForm");
const expenseForm = document.getElementById("expenseForm");

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");

const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const currentBalance = document.getElementById("currentBalance");

const totalIncomeEur = document.getElementById("totalIncomeEur");
const totalExpensesEur = document.getElementById("totalExpensesEur");
const currentBalanceEur = document.getElementById("currentBalanceEur");

const expenseCount = document.getElementById("expenseCount");
const largestExpense = document.getElementById("largestExpense");
const statisticsTotal = document.getElementById("statisticsTotal");

const errorMessage = document.getElementById("errorMessage");
const themeToggle = document.getElementById("themeToggle");

incomeForm.addEventListener("submit", addIncome);
expenseForm.addEventListener("submit", addExpense);

function addIncome(e){

    e.preventDefault();

    const name =
        document.getElementById("incomeName").value.trim();

    const amount =
        Number(document.getElementById("incomeAmount").value);

    const date =
        document.getElementById("incomeDate").value;

    if(name === "" || amount <= 0){
        alert("Въведете валиден приход.");
        return;
    }

    incomes.push({
        name,
        amount,
        date
    });

    renderIncomeList();
    updateFinance();

    incomeForm.reset();
}

function addExpense(e){

    e.preventDefault();

    const name =
        document.getElementById("expenseName").value.trim();

    const category =
        document.getElementById("expenseCategory").value;

    const amount =
        Number(document.getElementById("expenseAmount").value);

    const date =
        document.getElementById("expenseDate").value;

    const description =
        document.getElementById("expenseDescription").value;

    errorMessage.textContent = "";

    if(name === ""){
        errorMessage.textContent =
            "Въведете име на разход.";
        return;
    }

    if(amount <= 0){
        errorMessage.textContent =
            "Въведете валидна сума.";
        return;
    }

    expenses.push({
        name,
        category,
        amount,
        date,
        description
    });

    renderExpenseList();
    updateFinance();
    updateStatistics();

    expenseForm.reset();
}

function renderIncomeList(){

    incomeList.innerHTML = "";

    incomes.forEach(income => {

        const li =
            document.createElement("li");

        li.classList.add("income-item");

        li.innerHTML = `
            <div>
                <strong>${income.name}</strong><br>
                ${income.date}
            </div>

            <div>
                + ${income.amount.toFixed(2)} лв.
            </div>
        `;

        incomeList.appendChild(li);
    });
}

function renderExpenseList(){

    expenseList.innerHTML = "";

    expenses.forEach(expense => {

        const li =
            document.createElement("li");

        li.classList.add("expense-item");

        li.innerHTML = `
            <div>
                <strong>${expense.name}</strong><br>
                ${expense.category}<br>
                ${expense.date}
            </div>

            <div>
                - ${expense.amount.toFixed(2)} лв.
            </div>
        `;

        expenseList.appendChild(li);
    });
}

function updateFinance(){

    const incomeTotal =
        incomes.reduce(
            (sum,item) => sum + item.amount,
            0
        );

    const expenseTotal =
        expenses.reduce(
            (sum,item) => sum + item.amount,
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

    totalIncomeEur.textContent =
        (incomeTotal / EUR_RATE).toFixed(2) + " €";

    totalExpensesEur.textContent =
        (expenseTotal / EUR_RATE).toFixed(2) + " €";

    currentBalanceEur.textContent =
        (balance / EUR_RATE).toFixed(2) + " €";
}

function updateStatistics(){

    expenseCount.textContent =
        expenses.length;

    const total =
        expenses.reduce(
            (sum,item) => sum + item.amount,
            0
        );

    statisticsTotal.textContent =
        total.toFixed(2) + " лв.";

    if(expenses.length > 0){

        const max =
            Math.max(
                ...expenses.map(
                    item => item.amount
                )
            );

        largestExpense.textContent =
            max.toFixed(2) + " лв.";
    }
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        themeToggle.textContent =
            "☀️ Light Mode";
    }else{
        themeToggle.textContent =
            "🌙 Dark Mode";
    }

});