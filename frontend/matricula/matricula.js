document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('newEnrollmentBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('enrollmentForm');
  const table = document.getElementById('enrollmentsTable').querySelector('tbody');
  let editingRow = null;

  function openModal(editRow){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if(editRow){
      editingRow = editRow;
      document.getElementById('modalTitle').innerText = 'Editar Matrícula';
      const cells = editRow.querySelectorAll('td');
      const aluno = cells[0].textContent.trim();
      const id = cells[1].textContent.trim();
      const curso = cells[2].textContent.trim();
      const status = cells[3].textContent.trim();
      const dateParts = cells[4].textContent.trim().split('/');
      document.getElementById('aluno').value = id;
      document.getElementById('curso').value = curso;
      document.getElementById('status').value = status; // '✔️ Ativo' text; we'll normalize below
      if(dateParts.length === 3){
        document.getElementById('date').value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    } else {
      editingRow = null;
      document.getElementById('modalTitle').innerText = 'Nova Matrícula';
      form.reset();
    }
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  newBtn.addEventListener('click', ()=>openModal(null));
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  table.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return; const row = btn.closest('tr');
    if(btn.classList.contains('delete')){
      if(confirm('Deseja excluir esta matrícula?')) row.remove();
    } else if(btn.classList.contains('edit')){
      openModal(row);
    }
  });

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const alunoText = document.getElementById('aluno').selectedOptions[0].textContent.trim();
    const id = document.getElementById('aluno').value;
    const curso = document.getElementById('curso').value.trim();
    const status = document.getElementById('status').value;
    const dateVal = document.getElementById('date').value;
    const formatted = dateVal ? (()=>{ const d = new Date(dateVal); const dd = String(d.getDate()).padStart(2,'0'); const mm = String(d.getMonth()+1).padStart(2,'0'); const yy = d.getFullYear(); return `${dd}/${mm}/${yy}`; })() : '';

    const statusText = (status === 'Ativo') ? `<span class="status active">✔️ Ativo</span>` : `<span class="status inativo">✖️ Inativo</span>`;

    if(editingRow){
      const cells = editingRow.querySelectorAll('td');
      cells[0].textContent = alunoText;
      cells[1].textContent = id;
      cells[2].textContent = curso;
      cells[3].innerHTML = statusText;
      cells[4].textContent = formatted;
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${alunoText}</td>
        <td>${id}</td>
        <td>${curso}</td>
        <td>${statusText}</td>
        <td>${formatted}</td>
        <td class="actions"><button class="btn-icon edit">✏️</button><button class="btn-icon delete">🗑️</button></td>`;
      table.appendChild(tr);
    }
    closeModal();
  });
});
