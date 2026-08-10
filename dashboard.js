document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.btn-filter');
  const searchInput = document.getElementById('inputBusca');
  const tableRows = document.querySelectorAll('#tabelaPedidos tr');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      tableRows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        if (filterValue === 'todos' || rowStatus === filterValue) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase();

    tableRows.forEach(row => {
      const rowText = row.innerText.toLowerCase();
      if (rowText.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});