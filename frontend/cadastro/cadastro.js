document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const tipoContaSelect = document.getElementById('tipoConta');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const senhaErro = document.getElementById('senhaErro');
    const cadastroButton = form.querySelector('.btn-cadastro');
    const messageContainer = document.createElement('p'); // Novo container para feedback geral
    messageContainer.id = 'feedbackMessage';
    form.appendChild(messageContainer);


    // Configuração do URL do seu backend para a rota de cadastro
    const API_URL = 'http://localhost:3000/register'; 

    // Função utilitária para exibir mensagens
    const displayMessage = (text, type = 'error') => {
        messageContainer.textContent = text;
        messageContainer.style.padding = '10px';
        messageContainer.style.margin = '10px 0';

        if (type === 'success') {
            messageContainer.style.color = 'green';
            messageContainer.style.border = '1px solid green';
            messageContainer.style.backgroundColor = '#e6ffe6';
        } else if (type === 'info') {
            messageContainer.style.color = '#333';
            messageContainer.style.backgroundColor = '#ffffcc';
            messageContainer.style.border = '1px solid #ccc';
        } 
        else { // type === 'error'
            messageContainer.style.color = '#e33';
            messageContainer.style.border = '1px solid #e33';
            messageContainer.style.backgroundColor = '#ffeeee';
        }
    };


    // --- 1. Validação de Senhas em Tempo Real ---
    const validarSenhas = () => {
        const senha = senhaInput.value;
        const confirma = confirmarSenhaInput.value;

        // Limpa a validação HTML nativa e a mensagem de erro
        confirmarSenhaInput.setCustomValidity('');
        senhaErro.textContent = '';
        confirmarSenhaInput.classList.remove('error');

        if (senha && confirma && senha !== confirma) {
            senhaErro.textContent = 'As senhas não coincidem.';
            confirmarSenhaInput.setCustomValidity('Senhas não coincidem'); // Gatilho de erro nativo
            confirmarSenhaInput.classList.add('error');
            return false;
        } 
        return true;
    };

    // Adiciona o evento de 'input' para verificar em tempo real
    senhaInput.addEventListener('input', validarSenhas);
    confirmarSenhaInput.addEventListener('input', validarSenhas);


    // --- 2. Validação Completa de Formulário (Frontend) ---
    const validarFormulario = (dados) => {
        // Limpa todas as mensagens de erro anteriores
        displayMessage('', 'info');
        senhaErro.textContent = '';
        
        // 1. Validação de preenchimento (inputs obrigatórios com atributo 'required' já ajudam)
        if (!dados.nome_completo || !dados.email || !dados.senha || !dados.tipo_conta) {
            displayMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return false;
        }

        // 2. Validação de Email (formato)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dados.email)) {
            displayMessage('O formato do email é inválido.', 'error');
            emailInput.classList.add('error');
            return false;
        }
        emailInput.classList.remove('error');

        // 3. Validação de Senhas (tamanho e coincidência)
        if (dados.senha.length < 6) {
            displayMessage('A senha deve ter no mínimo 6 caracteres.', 'error');
            senhaInput.classList.add('error');
            return false;
        }
        senhaInput.classList.remove('error');
        
        if (!validarSenhas()) {
            displayMessage('As senhas digitadas não coincidem.', 'error');
            return false;
        }
        
        return true;
    };


    // --- 3. Evento de Envio do Formulário (Comunicação com Backend) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const dadosCadastro = {
            nome_completo: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            tipo_conta: tipoContaSelect.value === 'Administrador' ? 'Admin' : 'Secretaria', // Adapta para o valor do CHECK do banco
            senha: senhaInput.value 
        };

        if (!validarFormulario(dadosCadastro)) {
            return; 
        }

        // Desabilita o botão e notifica o usuário
        cadastroButton.disabled = true;
        cadastroButton.textContent = 'Cadastrando...';
        displayMessage('Enviando dados para o servidor...', 'info');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosCadastro)
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO: Usuário criado com sucesso (Status 201)
                displayMessage('🎉 Conta criada com sucesso! Redirecionando para o Login...', 'success');

                // Redirecionamento para a página de login
                setTimeout(() => {
                    window.location.href = '../login/index.html'; // Ajuste o caminho, se necessário
                }, 1500);

            } else {
                // ERRO: 409 (Email duplicado) ou 400 (Tipo de conta inválido, etc.)
                const errorMessage = data.error || 'Erro desconhecido ao tentar cadastrar.';
                displayMessage(`❌ Erro no cadastro: ${errorMessage}`);
            }

        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            displayMessage('Falha ao conectar ao servidor. Verifique sua conexão ou se o backend está ativo.', 'error');
        } finally {
            cadastroButton.disabled = false;
            cadastroButton.textContent = 'Cadastrar';
        }
    });
});