document.addEventListener('DOMContentLoaded', () => {
  const newBtn = document.getElementById('newTicketBtn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('ticketForm');
  const table = document.getElementById('ticketsTable').querySelector('tbody');
  let editingRow = null;

  function openModal(editRow){
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
    if(editRow){
      editingRow = editRow;
      document.getElementById('modalTitle').innerText = 'Editar Solicitação';
      const cells = editRow.querySelectorAll('td');
      document.getElementById('solicitante').value = cells[0].textContent.trim();
      document.getElementById('tipo').value = cells[1].textContent.trim();
      document.getElementById('descricao').value = cells[2].textContent.trim();
      const prio = cells[3].querySelector('.chip').textContent.trim();
      const pMap = {'Alta':'alta','Média':'media','Baixa':'baixa'};
      document.getElementById('prioridade').value = pMap[prio] || 'baixa';
      const statusSelect = cells[4].querySelector('.status-select');
      if(statusSelect){
        document.getElementById('status').value = statusSelect.value;
      } else {
        const statText = cells[4].textContent.trim();
        const sMap = {'Aberto':'open','Em Andamento':'inprogress','Fechado':'resolved','Resolvido':'resolved'};
        document.getElementById('status').value = sMap[statText] || 'open';
      }
      const dateParts = cells[5].textContent.trim().split('/');
      if(dateParts.length === 3){
        document.getElementById('date').value = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    } else {
      editingRow = null;
      document.getElementById('modalTitle').innerText = 'Nova Solicitação';
      form.reset();
    }
  }

  function closeModal(){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }

  function normalizePriority(value){
    if(value === 'alta') return '<span class="chip high">Alta</span>';
    if(value === 'media') return '<span class="chip media">Média</span>';
    return '<span class="chip baixa">Baixa</span>';
  }

  function normalizeStatus(value){
    // return a status select HTML that matches the table select version
    return `\
      <select class="status-select" data-value="${value}">\
        <option value="open" ${value === 'open' ? 'selected' : ''}>Aberto</option>\
        <option value="inprogress" ${value === 'inprogress' ? 'selected' : ''}>Andamento</option>\
        <option value="resolved" ${value === 'resolved' ? 'selected' : ''}>Resolvido</option>\
      </select>`;
  }

  newBtn.addEventListener('click', ()=> openModal(null));
  modalClose.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  table.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('button');
    if(!btn) return; const row = btn.closest('tr');
    if(btn.classList.contains('delete')){
      if(confirm('Deseja excluir esta solicitação?')) row.remove();
    } else if(btn.classList.contains('edit')){
      openModal(row);
    }
  });

  // handle change events on status-select elements inside the table
  table.addEventListener('change', (ev)=>{
    const sel = ev.target.closest('.status-select');
    if(!sel) return;
    // set data-value attribute so CSS can style via selectors
    sel.dataset.value = sel.value;
  });

  // initialize any existing status-select elements to set data-value
  document.querySelectorAll('.status-select').forEach((sel)=>{ sel.dataset.value = sel.value; });

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const solicitante = document.getElementById('solicitante').value.trim();
    const tipo = document.getElementById('tipo').value.trim();
    const descricao = document.getElementById('descricao').value.trim();
    const prioridade = document.getElementById('prioridade').value;
    const status = document.getElementById('status').value;
    const dateVal = document.getElementById('date').value;
    const formattedDate = dateVal ? (()=>{ const d=new Date(dateVal); const dd=String(d.getDate()).padStart(2,'0'); const mm=String(d.getMonth()+1).padStart(2,'0'); const yy=d.getFullYear(); return `${dd}/${mm}/${yy}`; })() : '';

    const prioHtml = normalizePriority(prioridade);
    const statusHtml = normalizeStatus(status);

    if(editingRow){
      const cells = editingRow.querySelectorAll('td');
      cells[0].textContent = solicitante;
      cells[1].textContent = tipo;
      cells[2].textContent = descricao;
      cells[3].innerHTML = prioHtml;
      cells[4].innerHTML = statusHtml;
      cells[5].textContent = formattedDate;
    } else {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${solicitante}</td>
        <td>${tipo}</td>
        <td>${descricao}</td>
        <td>${prioHtml}</td>
        <td>${statusHtml}</td>
        <td>${formattedDate}</td>
        <td class="actions"><button class="btn-icon edit">✏️</button><button class="btn-icon delete">🗑️</button></td>`;
      table.appendChild(tr);
      // ensure status-select is styled
      const sel = tr.querySelector('.status-select'); if(sel) sel.dataset.value = sel.value;
    }
    closeModal();
  });
});
