document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('newNoteBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('noteForm');
  const table = document.getElementById('gradesTable').querySelector('tbody');
  let editingRow = null;

  function openModal(editRow){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    if(editRow){
      editingRow = editRow;
      document.getElementById('modalTitle').innerText = 'Editar Nota';
      const cells = editRow.querySelectorAll('td');
      document.getElementById('aluno').value = '1'; // demo
      document.getElementById('disciplina').value = cells[1].textContent.trim();
      const notaVal = cells[2].textContent.trim();
      document.getElementById('nota').value = notaVal;
      document.getElementById('presenca').value = cells[3].textContent.trim().replace('%','');
      document.getElementById('periodo').value = cells[4].textContent.trim();
      // status: set by value mapping
      const stat = cells[5].textContent.trim();
      const statusSelect = document.getElementById('status');
      if(stat.includes('Aprov')) statusSelect.value = 'aprov';
      else if(stat.includes('Reprov')) statusSelect.value = 'reprov';
      else statusSelect.value = 'recuperacao';
    } else {
      editingRow = null;
      document.getElementById('modalTitle').innerText = 'Lançar Nota';
      form.reset();
    }
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  newBtn.addEventListener('click', ()=> openModal(null));
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  table.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return; const row = btn.closest('tr');
    if(btn.classList.contains('delete')){
      if(confirm('Deseja excluir esta nota?')) row.remove();
    } else if(btn.classList.contains('edit')){
      openModal(row);
    }
  });

  function createStatusChip(classKey){
    if(classKey === 'aprov') return `<span class="status aprov">Aprovado</span>`;
    if(classKey === 'reprov') return `<span class="status reprov">Reprovado</span>`;
    return `<span class="status recuperacao">Recuperação</span>`;
  }

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const alunoText = document.getElementById('aluno').selectedOptions[0].textContent.trim();
    const disciplina = document.getElementById('disciplina').value.trim();
    const nota = parseFloat(document.getElementById('nota').value) || 0;
    const pres = document.getElementById('presenca').value ? `${document.getElementById('presenca').value}%` : '';
    const periodo = document.getElementById('periodo').value;
    const statusKey = document.getElementById('status').value;
    const chip = createStatusChip(statusKey);

    if(editingRow){
      const cells = editingRow.querySelectorAll('td');
      cells[0].textContent = alunoText;
      cells[1].textContent = disciplina;
      cells[2].innerHTML = `<strong>${nota}</strong>`;
      cells[3].textContent = pres;
      cells[4].textContent = periodo;
      cells[5].innerHTML = chip;
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${alunoText}</td>
        <td>${disciplina}</td>
        <td><strong>${nota}</strong></td>
        <td>${pres}</td>
        <td>${periodo}</td>
        <td>${chip}</td>
        <td class="actions"><button class="btn-icon edit">✏️</button><button class="btn-icon delete">🗑️</button></td>`;
      table.appendChild(tr);
    }
    closeModal();
  });
});
