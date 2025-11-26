document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('newCourseBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('courseForm');
  const tableBody = document.getElementById('coursesTable').querySelector('tbody');
  let editingRow = null;

  function openModal(editRow){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if(editRow){
      editingRow = editRow;
      document.getElementById('modalTitle').innerText = 'Editar Curso / Turma';
      const cells = editRow.querySelectorAll('td');
      document.getElementById('turma').value = cells[0].textContent.trim();
      document.getElementById('codigo').value = cells[1].textContent.trim();
      document.getElementById('professor').value = cells[2].textContent.trim();
      document.getElementById('capacidade').value = cells[3].textContent.trim();
      const ocpText = cells[4].textContent.trim().split('/');
      document.getElementById('ocupacao').value = ocpText[0] || '';
    } else {
      editingRow = null;
      document.getElementById('modalTitle').innerText = 'Novo Curso / Turma';
      form.reset();
    }
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  newBtn.addEventListener('click', ()=> openModal(null));
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  tableBody.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return;
    const row = btn.closest('tr');
    if(btn.classList.contains('edit')){
      openModal(row);
    } else if(btn.classList.contains('delete')){
      if(confirm('Deseja excluir esta turma?')){
        row.remove();
      }
    }
  });

  function updateOccupationCell(cell, used, cap){
    const td = cell;
    td.textContent = `${used}/${cap}`;
    td.dataset.used = used;
    // colorize if near capacity
    const usedPercent = (used / cap) * 100;
    if(usedPercent >= 100){
      td.style.color = '#d9534f'; // red
    } else if(usedPercent >= 80){
      td.style.color = '#ffa500'; // orange
    } else {
      td.style.color = '#28a745'; // green
    }
  }

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const turma = document.getElementById('turma').value.trim();
    const codigo = document.getElementById('codigo').value.trim();
    const professor = document.getElementById('professor').value.trim();
    const capacidade = Number(document.getElementById('capacidade').value);
    const ocupacaoVal = Number(document.getElementById('ocupacao').value) || 0;

    if(editingRow){
      const cells = editingRow.querySelectorAll('td');
      cells[0].textContent = turma;
      cells[1].textContent = codigo;
      cells[2].textContent = professor;
      cells[3].textContent = capacidade;
      updateOccupationCell(cells[4], ocupacaoVal, capacidade);
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${turma}</td>
        <td>${codigo}</td>
        <td>${professor}</td>
        <td>${capacidade}</td>
        <td class="ocupation" data-used="${ocupacaoVal}">${ocupacaoVal}/${capacidade}</td>
        <td class="actions">
          <button class="btn-icon edit" title="Editar">✏️</button>
          <button class="btn-icon delete" title="Excluir">🗑️</button>
        </td>`;
      tableBody.appendChild(tr);
      // colorize
      updateOccupationCell(tr.querySelector('.ocupation'), ocupacaoVal, capacidade);
    }

    closeModal();
  });

  // initial colorize
  document.querySelectorAll('.ocupation').forEach((cell)=>{
    const used = Number(cell.dataset.used || 0);
    const capRow = Number(cell.closest('tr').querySelector('td:nth-child(4)').textContent.trim());
    updateOccupationCell(cell, used, capRow);
  });
});
