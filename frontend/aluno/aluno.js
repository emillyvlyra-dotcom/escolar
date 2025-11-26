document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('newStudentBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('studentForm');
  const table = document.getElementById('studentsTable').querySelector('tbody');
  let editingRow = null;

  function openModal(editRow){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (editRow) {
      // populate fields
      editingRow = editRow;
      document.getElementById('modalTitle').innerText = 'Editar Aluno';
      const cells = editRow.querySelectorAll('td');
      document.getElementById('name').value = cells[0].textContent.trim();
      document.getElementById('cpf').value = cells[1].textContent.trim();
      const parts = cells[2].textContent.trim().split('/');
      if(parts.length ===3){
        document.getElementById('dob').value = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      document.getElementById('email').value = cells[3].textContent.trim();
      document.getElementById('phone').value = cells[4].textContent.trim();
    } else {
      editingRow = null;
      document.getElementById('modalTitle').innerText = 'Novo Aluno';
      form.reset();
      // set date default to empty
      document.getElementById('dob').value = '';
    }
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  newBtn.addEventListener('click', () => openModal(null));
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // handle delete/edit using event delegation
  table.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if(!btn) return;
    const row = btn.closest('tr');
    if (btn.classList.contains('delete')){
      if (confirm('Deseja excluir este aluno?')){
        row.remove();
      }
    } else if (btn.classList.contains('edit')){
      openModal(row);
    }
  });

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const name = document.getElementById('name').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // format date dd/mm/yyyy
    const formattedDob = dob ? (() => {
      const d = new Date(dob);
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const yy = d.getFullYear();
      return `${dd}/${mm}/${yy}`;
    })() : '';

    if(editingRow){
      const cells = editingRow.querySelectorAll('td');
      cells[0].textContent = name;
      cells[1].textContent = cpf;
      cells[2].textContent = formattedDob;
      cells[3].textContent = email;
      cells[4].textContent = phone;
    }else{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${name}</td>
        <td>${cpf}</td>
        <td>${formattedDob}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td class="actions">
          <button class="btn-icon edit" title="Editar">✏️</button>
          <button class="btn-icon delete" title="Excluir">🗑️</button>
        </td>`;
      table.appendChild(tr);
    }

    closeModal();
  })
});
