document.addEventListener('DOMContentLoaded', () => {
  // Bar chart data: Matriculas por Mês
  const barCtx = document.getElementById('barChart').getContext('2d');
  const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      datasets: [{
        label: 'Matrículas',
        data: [45, 55, 50, 61, 55],
        backgroundColor: '#3f72ff',
        borderRadius: 6,
        barThickness: 28,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {display:false}
      },
      scales: {
        x: {
          grid: {display:false}
        },
        y: {
          beginAtZero:true,
          grid: {color: '#eee'}
        }
      }
    }
  });

  // Pie chart data: Distribuição por Turma
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['EM-1', 'EM-2', 'EM-3'],
      datasets: [{
        label: 'Distribuição por Turma',
        data: [28, 32, 25],
        backgroundColor: ['#8a76f9', '#8a76f9cc', '#8a76f999'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {position: 'right'}
      }
    }
  });
});
