let data = {
  income: 0,
  expenses: {},
  limits: {}
};

function loadData() {
  const saved = localStorage.getItem("budgetProData");
  if (saved) {
    data = JSON.parse(saved);
  }
}

function saveData() {
  localStorage.setItem("budgetProData", JSON.stringify(data));
}

function updateCategoryOptions() {
  const expenseCat = document.getElementById("expense-category");
  const limitCat = document.getElementById("limit-category");
  expenseCat.innerHTML = '';
  limitCat.innerHTML = '';
  for (let cat in data.expenses) {
    const opt1 = new Option(cat, cat);
    const opt2 = new Option(cat, cat);
    expenseCat.add(opt1);
    limitCat.add(opt2);
  }
}

function updateSummary() {
  const summary = document.getElementById("summary");
  summary.innerHTML = "<strong>Total Income:</strong> $" + data.income.toFixed(2);

  let labels = [];
  let totals = [];

  for (let cat in data.expenses) {
    const total = data.expenses[cat].reduce((sum, e) => sum + e.amount, 0);
    const limit = data.limits[cat] || 0;
    const status = total > limit ? "Over Budget!" : "";
    summary.innerHTML += `<p><strong>${cat}:</strong> $${total.toFixed(2)} / $${limit.toFixed(2)} <span style="color:red;">${status}</span></p>`;
    labels.push(cat);
    totals.push(total);
  }

  renderChart(labels, totals);
}

function renderChart(labels, dataPoints) {
  const ctx = document.getElementById('budgetChart').getContext('2d');
  if (window.budgetChart) {
    window.budgetChart.destroy();
  }
  window.budgetChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses',
        data: dataPoints
      }]
    }
  });
}

document.getElementById("income-form").addEventListener("submit", e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById("income-amount").value);
  if (!isNaN(amount)) {
    data.income += amount;
    saveData();
    updateSummary();
    e.target.reset();
  }
});

document.getElementById("expense-form").addEventListener("submit", e => {
  e.preventDefault();
  const desc = document.getElementById("expense-desc").value;
  const amount = parseFloat(document.getElementById("expense-amount").value);
  const category = document.getElementById("expense-category").value;
  if (desc && !isNaN(amount)) {
    if (!data.expenses[category]) data.expenses[category] = [];
    data.expenses[category].push({ desc, amount });
    saveData();
    updateSummary();
    e.target.reset();
  }
});

document.getElementById("limit-form").addEventListener("submit", e => {
  e.preventDefault();
  const category = document.getElementById("limit-category").value;
  const amount = parseFloat(document.getElementById("limit-amount").value);
  if (!isNaN(amount)) {
    data.limits[category] = amount;
    saveData();
    updateSummary();
    e.target.reset();
  }
});

document.getElementById("new-category-form").addEventListener("submit", e => {
  e.preventDefault();
  const newCat = document.getElementById("new-category").value.trim();
  if (newCat && !data.expenses[newCat]) {
    data.expenses[newCat] = [];
    saveData();
    updateCategoryOptions();
    updateSummary();
    e.target.reset();
  }
});

loadData();
updateCategoryOptions();
updateSummary();
