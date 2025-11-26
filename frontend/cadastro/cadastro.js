document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroForm');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const senhaErro = document.getElementById('senhaErro');

    // Função para validar se as senhas coincidem
    const validarSenhas = () => {
        if (senhaInput.value !== confirmarSenhaInput.value) {
            senhaErro.textContent = 'As senhas não coincidem.';
            confirmarSenhaInput.setCustomValidity('Senhas não coincidem');
            return false;
        } else {
            senhaErro.textContent = ''; // Limpa a mensagem de erro
            confirmarSenhaInput.setCustomValidity('');
            return true;
        }
    };

    // Adiciona o evento de 'input' para verificar em tempo real
    senhaInput.addEventListener('input', validarSenhas);
    confirmarSenhaInput.addEventListener('input', validarSenhas);

    // Evento de envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão

        // Valida as senhas uma última vez antes de enviar
        if (!validarSenhas()) {
            // Se as senhas não coincidirem, o setCustomValidity já impediu o envio,
            // mas exibimos o erro visualmente.
            return;
        }

        // Se chegou aqui, o formulário é válido (campos preenchidos e senhas iguais)
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const tipoConta = document.getElementById('tipoConta').value;

        // **Ação de Cadastro (Simulada)**
        console.log('--- Dados de Cadastro ---');
        console.log(`Nome: ${nome}`);
        console.log(`Email: ${email}`);
        console.log(`Tipo de Conta: ${tipoConta}`);
        console.log('Senha (não enviada em console por segurança): *******');

        alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome}!`);

        // Após o envio (em um ambiente real), você faria:
        // 1. Envio dos dados para o servidor via fetch/XMLHttpRequest
        // 2. Redirecionamento para a página de login ou dashboard
        
        form.reset(); // Limpa o formulário após a simulação de sucesso
    });
});