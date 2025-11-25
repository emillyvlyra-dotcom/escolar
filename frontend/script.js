document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const message = document.getElementById('message');

  // Basic client-side validation + demo auth check
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    message.textContent = '';
    const e = email.value.trim();
    const p = password.value.trim();

    if (!e || !p) {
      message.textContent = 'Por favor preencha email e senha.';
      message.style.color = '#e33';
      return;
    }

    // Demo credentials
    const allowed = ['admin@escola.com', 'secretaria@escola.com'];
    if (allowed.includes(e) && p === '123456') {
      message.textContent = 'Login realizado com sucesso (demo). Redirecionando...';
      message.style.color = 'var(--accent-dark)';
      // simple redirect after a short delay (demo-only)
      setTimeout(() => {
        message.textContent = 'Bem-vindo ao sistema! (Página de destino de demonstração)';
      }, 900);
      return;
    }

    message.textContent = 'Usuário ou senha incorretos.';
    message.style.color = '#e33';
  });
});
