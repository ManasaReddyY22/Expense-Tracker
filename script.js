const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const dateInput = document.getElementById('date');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function getEmoji(category) {
  switch (category) {
    case 'Food': return '🍔';
    case 'Transport': return '🚌';
    case 'Shopping': return '🛍️';
    case 'Other': return '📝';
    default: return '';
  }
}

function getColor(category) {
  switch (category) {
    case 'Food': return '#e67e22';
    case 'Transport': return '#3498db';
    case 'Shopping': return '#9b59b6';
    case 'Other': return '#95a5a6';
    default: return '#7f8c8d';
  }
}

function updateList() {
  expenseList.innerHTML = '';
  let total = 0;

  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    const emoji = getEmoji(expense.category);
    const color = getColor(expense.category);

    li.style.borderLeftColor = color;
    li.innerHTML = `
      ${emoji} ${expense.description} - ₹${expense.amount} (${expense.category}) 
      <small>${expense.date}</small>
      <button class="delete-btn" onclick="deleteExpense(${index})">✖</button>
    `;
    expenseList.appendChild(li);
    total += parseFloat(expense.amount);
  });

  totalAmount.textContent = total.toFixed(2);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  updateChart();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateList();
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const description = document.getElementById('description').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;
  const date = dateInput.value;

  if (description && amount && category && date) {
    expenses.push({ description, amount, category, date });
    updateList();
    form.reset();
  }
});

// ==================== CHART.JS ======================

const ctx = document.getElementById('summary-chart').getContext('2d');
let expenseChart;

function updateChart() {
  const monthlyData = {};

  expenses.forEach(exp => {
    const month = exp.date.slice(0, 7); // 'YYYY-MM'
    monthlyData[month] = (monthlyData[month] || 0) + parseFloat(exp.amount);
  });

  const labels = Object.keys(monthlyData);
  const data = Object.values(monthlyData);

  if (expenseChart) expenseChart.destroy(); // Clear existing chart

  expenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Expenses (₹)',
        data: data,
        backgroundColor: '#2ecc71'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return '₹' + value;
            }
          }
        }
      }
    }
  });
}

updateList(); // Initialize
