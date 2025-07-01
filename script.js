
// Load from localStorage or start fresh
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Format currency
const formatter = new Intl.NumberFormat("hi-IN", {
  style: "currency",
  currency: "INR",
  signDisplay: "always",
});

// Get elements
const list = document.querySelector("#transactionList");
const form = document.querySelector("#transactionForm");
const balance = document.querySelector("#balance");
const income = document.querySelector("#income");
const expense = document.querySelector("#expenses");
const status = document.querySelector("#status");

// Submit form
form.addEventListener("submit", addTransaction);

// Add new transaction
function addTransaction(e) {
  e.preventDefault();
  const formData = new FormData(form);

  const transaction = {
    id: Date.now(),
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: formData.get("date"),
    type: formData.get("type") === "on" ? "income" : "expense",
  };

  transactions.push(transaction);
  saveTransactions();
  renderList();
  updateTotals();
  form.reset();
}

// Update totals
function updateTotals() {
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = incomeTotal - expenseTotal;

  balance.textContent = formatter.format(totalBalance);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

// Save to localStorage
function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render transaction list
function renderList() {
  list.innerHTML = "";
  status.textContent = "";

  if (transactions.length === 0) {
    status.textContent = "No transactions.";
    return;
  }

  transactions.forEach((t) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${t.name}</h4>
        <p>${new Date(t.date).toLocaleDateString()}</p>
      </div>

      <div class="amount" ${t.type}>
        <span>${formatter.format(t.type === "income" ? t.amount : - t.amount)}</span>
      </div>

      <div class="action" data-id="${t.id}">
        <i class="fa-solid fa-xmark"></i>
      </div>
    `;

    list.appendChild(li);
  });
}

// Delete transaction
list.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".action");
  if (delBtn && delBtn.dataset.id) {
    const id = Number(delBtn.dataset.id);
    transactions = transactions.filter((t) => t.id !== id);
    saveTransactions();
    renderList();
    updateTotals();
  }
});

// Initial render
renderList();
updateTotals();