document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const message = document.getElementById('message');
    const loginButton = form.querySelector('button[type="submit"]');

    // Configuração do URL do seu backend
    const API_URL = 'http://localhost:3000/login'; 
    
    // Função utilitária para exibir mensagens
    const displayMessage = (text, type = 'error') => {
        message.textContent = text;
        if (type === 'success') {
            message.style.color = 'green';
            message.style.backgroundColor = '#e6ffe6';
        } else {
            message.style.color = '#e33';
            message.style.backgroundColor = '#ffeeee';
        }
        message.classList.add('visible');
    };

    // --- 1. Validação de Formulário ---
    const validateForm = (e, p) => {
        // Limpa classes e mensagens
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        message.classList.remove('visible');

        if (!e) {
            emailInput.classList.add('error');
            displayMessage('O campo Email é obrigatório.');
            return false;
        }

        // Validação básica de formato de email (para front-end)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(e)) {
            emailInput.classList.add('error');
            displayMessage('Por favor, insira um formato de email válido.');
            return false;
        }

        if (!p) {
            passwordInput.classList.add('error');
            displayMessage('O campo Senha é obrigatório.');
            return false;
        }

        // Validação de tamanho mínimo (se aplicável, mas o backend é quem decide a segurança)
        if (p.length < 6) {
            passwordInput.classList.add('error');
            displayMessage('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        return true;
    };


    // --- 2. Envio do Formulário (Comunicação com Backend) ---
    form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!validateForm(email, password)) {
            return; // Interrompe se a validação falhar
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Aguarde...';
        displayMessage('Tentando login...', 'info');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, senha: password }) // 'senha' deve corresponder ao nome esperado pelo backend
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO NO LOGIN (Resposta 200)
                displayMessage(`Bem-vindo, ${data.usuario.nome}! Redirecionando...`, 'success');
                
                // Exemplo: Armazenar informações do usuário (pode ser um JWT no futuro)
                localStorage.setItem('userEmail', data.usuario.email);
                localStorage.setItem('userType', data.usuario.tipo_conta);
                // NOTA: NUNCA ARMAZENE A SENHA NO FRONTEND.

                // Redirecionamento para o Dashboard
                setTimeout(() => {
                    // Ajuste o caminho relativo conforme a localização do seu arquivo
                    window.location.href = '../Dashboard/dashboard.html';
                }, 900);

            } else {
                // ERRO NO LOGIN (Resposta 401, 400, etc.)
                // A mensagem de erro vem do backend (ex: "E-mail ou senha inválidos.")
                displayMessage(data.error || 'Erro desconhecido ao tentar logar.');
            }

        } catch (error) {
            console.error('Erro na requisição de login:', error);
            displayMessage('Falha ao conectar ao servidor. Verifique se o backend está ativo.');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
        }
    });
});

// Show/hide password toggle (Mantido)
document.addEventListener('DOMContentLoaded', () => {
    const showChk = document.getElementById('showPass');
    const pwd = document.getElementById('password');
    if (showChk && pwd) {
        showChk.addEventListener('change', () => {
            pwd.type = showChk.checked ? 'text' : 'password';
        });
    }
});