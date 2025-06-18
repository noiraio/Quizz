// Variáveis globais
let nomeUsuario = '';
let perguntaAtual = 0;
let pontuacao = 0;
let tentativasRestantes = 1; // 1 tentativa extra além da primeira
const perguntas = [
    {
        pergunta: "Quantas classes existem em Dungeons and Dragons?",
        opcoes: ["10", "13", "5", "37"],
        respostaCorreta: 1
    },
    {
        pergunta: "O que é um clérigo?",
        opcoes: ["São donos de boteco", "São aqueles dedicados a uma divindade, a um conceito ou filosofia. ", "São pessoas que executam magias de alto nível", "São pessoas ruins que já nascem com o coração corrompido"],
        respostaCorreta: 1
    },
    {
        pergunta: "Qual é a principal característica de um tiefiling?",
        opcoes: ["Brilham no escuro", "Tem chifres", "É uma raça de gente safada", "É uma raça que os ancestrais humanos fizeram uma barganha com demônios para aumentar seu poder"],
        respostaCorreta: 3
    },
    {
        pergunta: "O que é um Vastaya?",
        opcoes: ["É só uma raça, nada de especial", "Um therian", "É uma raça mística de quimérica , com características tanto humanas quanto animais", "Um furry"],
        respostaCorreta: 2
    },
    {
        pergunta: "O que representa um monge em D&D?",
        opcoes: ["Ser uma tartaruga idosa em Kong Fu Panda", "ser aqueles que nasceram com a dedicação e devoção nata, treinar e desenvolver a habilidade controlar a essência vital das criaturas", "Meditar a vida toda", "Ser velho"],
        respostaCorreta: 1
    }
];

// Elementos DOM
const telaInicial = document.getElementById('telaInicial');
const telaPerguntas = document.getElementById('telaPerguntas');
const telaFinal = document.getElementById('telaFinal');
const nomeInput = document.getElementById('nomeInput');
const btnIniciar = document.getElementById('btnIniciar');
const btnSair = document.getElementById('btnSair');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnSairFinal = document.getElementById('btnSairFinal');
const perguntaContainer = document.getElementById('perguntaContainer');
const perguntaElement = document.getElementById('pergunta');
const opcoesElement = document.getElementById('opcoes');
const feedback = document.getElementById('feedback');
const resultadoFinal = document.getElementById('resultadoFinal');
const emojiResultado = document.getElementById('emojiResultado');
const pontuacaoFinal = document.getElementById('pontuacaoFinal');
const porcentagemFinal = document.getElementById('porcentagemFinal');
const mensagemFinal = document.getElementById('mensagemFinal');
const estrelasElement = document.getElementById('estrelas');
const progressoBarra = document.getElementById('progressoBarra');
const contadorPerguntas = document.getElementById('contadorPerguntas');
const tentativasElement = document.getElementById('tentativas');
const body = document.body;

// Event Listeners
btnIniciar.addEventListener('click', iniciarQuiz);
btnSair.addEventListener('click', sairQuiz);
btnReiniciar.addEventListener('click', reiniciarQuiz);
btnSairFinal.addEventListener('click', sairQuiz);

// Funções
function iniciarQuiz() {
    nomeUsuario = nomeInput.value.trim();
    if (nomeUsuario === '') {
        alert('Por favor, digite seu nome antes de começar!');
        return;
    }

    telaInicial.style.display = 'none';
    telaPerguntas.style.display = 'flex';
    perguntaContainer.style.display = 'flex';
    mostrarPergunta();
}

function mostrarPergunta() {
    if (perguntaAtual >= perguntas.length) {
        mostrarTelaFinal();
        return;
    }

    // Resetar tentativas
    tentativasRestantes = 1;
    atualizarTentativasUI();

    // Atualiza contador de perguntas
    contadorPerguntas.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

    const perguntaData = perguntas[perguntaAtual];
    perguntaElement.textContent = perguntaData.pergunta;
    opcoesElement.innerHTML = '';

    perguntaData.opcoes.forEach((opcao, index) => {
        const opcaoElement = document.createElement('button');
        opcaoElement.classList.add('opcao', `opcao${index + 1}`);
        opcaoElement.textContent = opcao;
        opcaoElement.addEventListener('click', () => verificarResposta(index));
        opcoesElement.appendChild(opcaoElement);
    });
}

function atualizarTentativasUI() {
    tentativasElement.innerHTML = '';
    for (let i = 0; i <= tentativasRestantes; i++) {
        const tentativa = document.createElement('div');
        tentativa.classList.add('tentativa');
        if (i <= tentativasRestantes) {
            tentativa.classList.add('ativa');
        }
        tentativasElement.appendChild(tentativa);
    }
}

function verificarResposta(opcaoIndex) {
    const respostaCorreta = perguntas[perguntaAtual].respostaCorreta;
    const opcoes = document.querySelectorAll('.opcao');

    if (opcaoIndex === respostaCorreta) {
        // Resposta correta
        opcoes[opcaoIndex].classList.add('acertou');
        pontuacao += (tentativasRestantes + 1); // Pontuação maior se acertar na primeira tentativa
        mostrarFeedback(true);
        desabilitarOpcoes();
        setTimeout(() => {
            perguntaAtual++;
            resetarTela();
            mostrarPergunta();
        }, 1500);
    } else {
        // Resposta incorreta
        opcoes[opcaoIndex].classList.add('opcao-incorreta');
        
        if (tentativasRestantes > 0) {
            // Ainda tem tentativas
            tentativasRestantes--;
            atualizarTentativasUI();
            mostrarFeedback(false, true);
        } else {
            // Sem tentativas restantes
            opcoes[respostaCorreta].classList.add('acertou');
            mostrarFeedback(false);
            desabilitarOpcoes();
            setTimeout(() => {
                perguntaAtual++;
                resetarTela();
                mostrarPergunta();
            }, 1500);
        }
    }
}

function desabilitarOpcoes() {
    const opcoes = document.querySelectorAll('.opcao');
    opcoes.forEach(opcao => {
        opcao.style.pointerEvents = 'none';
    });
}

function mostrarFeedback(acertou, temTentativas = false) {
    feedback.innerHTML = '';
    const feedbackMsg = document.createElement('div');
    
    if (acertou) {
        feedbackMsg.textContent = 'Acertou!';
        feedbackMsg.classList.add('acertou');
        body.classList.add('body-escurecido');
        criarConfetti();
    } else if (temTentativas) {
        feedbackMsg.textContent = 'Tente novamente!';
        feedbackMsg.classList.add('errou');
    } else {
        feedbackMsg.textContent = 'Errou!';
        feedbackMsg.classList.add('errou');
        body.classList.add('body-mais-escurecido');
    }

    feedback.appendChild(feedbackMsg);
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
        if (!temTentativas) {
            body.classList.remove('body-escurecido', 'body-mais-escurecido');
        }
    }, temTentativas ? 800 : 1500);
}

function criarConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`;
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        document.body.appendChild(confetti);
        
        // Animação
        const animation = confetti.animate([
            { transform: `translateY(-${Math.random() * 20}vh) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${Math.random() * 100 + 100}vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

function resetarTela() {
    feedback.style.display = 'none';
    body.classList.remove('body-escurecido', 'body-mais-escurecido');
}

function mostrarTelaFinal() {
    telaPerguntas.style.display = 'none';
    telaFinal.style.display = 'flex';
    document.querySelector('.tela-final').style.display = 'flex';

    const pontuacaoMaxima = perguntas.length * 2; // Máximo de 2 pontos por pergunta
    const porcentagem = Math.round((pontuacao / pontuacaoMaxima) * 100);

    // Atualiza a barra de progresso
    progressoBarra.style.width = `${porcentagem}%`;

    // Mostra a porcentagem
    porcentagemFinal.textContent = `${porcentagem}%`;

    // Mostra a pontuação
    pontuacaoFinal.textContent = `Você acertou ${pontuacao} de ${pontuacaoMaxima} pontos`;

    // Determina o resultado com base na porcentagem
    let mensagem, emoji, estrelas;
    
    if (porcentagem === 100) {
        mensagem = `Parabéns ${nomeUsuario}, você acertou tudo com perfeição!`;
        emoji = "✨🎉🏆";
        estrelas = 5;
        criarConfetti();
    } else if (porcentagem >= 80) {
        mensagem = `Excelente trabalho ${nomeUsuario}! Você foi incrível!`;
        emoji = "😊🌟👍";
        estrelas = 4;
        criarConfetti();
    } else if (porcentagem >= 60) {
        mensagem = `Bom trabalho ${nomeUsuario}! Você foi bem!`;
        emoji = "😃👍";
        estrelas = 3;
    } else if (porcentagem >= 40) {
        mensagem = `${nomeUsuario}, você foi ok! Com mais prática você melhora!`;
        emoji = "🙂";
        estrelas = 2;
    } else {
        mensagem = `${nomeUsuario}, você pode melhorar! Continue praticando!`;
        emoji = "💪📚";
        estrelas = 1;
    }

    resultadoFinal.textContent = mensagem;
    emojiResultado.textContent = emoji;
    
    // Adiciona estrelas de avaliação
    estrelasElement.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const estrela = document.createElement('span');
        estrela.classList.add('estrela');
        estrela.textContent = i < estrelas ? '★' : '☆';
        estrelasElement.appendChild(estrela);
    }

    // Mensagem final personalizada
    if (porcentagem >= 80) {
        mensagemFinal.textContent = "Você demonstrou um excelente conhecimento! Continue assim!";
    } else if (porcentagem >= 60) {
        mensagemFinal.textContent = "Você está no caminho certo! Um pouco mais de estudo e você chega lá!";
    } else {
        mensagemFinal.textContent = "Não desanime! Cada erro é uma oportunidade de aprendizado.";
    }
}

function reiniciarQuiz() {
    perguntaAtual = 0;
    pontuacao = 0;
    telaFinal.style.display = 'none';
    telaInicial.style.display = 'flex';
    nomeInput.value = '';
}

function sairQuiz() {
    if (confirm('Deseja realmente sair do quiz?')) {
        window.close();
    }
}