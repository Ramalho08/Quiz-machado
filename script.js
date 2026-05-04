// ===== PERGUNTAS DO QUIZ =====
const quizQuestions = [
    {
        question: "Em qual livro Machado de Assis narra a história de um homem que se torna amigo de Cappitu?",
        options: ["Dom Casmurro", "Quincas Borba", "Memórias Póstumas de Brás Cubas", "Esaú e Jacó"],
        correct: 0
    },
    {
        question: "Qual era o principal suspeita do ciúmes de Dom Casmurro em relação a Capitu?",
        options: ["Seu primo Paulo", "O vizinho português", "Escobar", "O padre seminário"],
        correct: 2
    },
    {
        question: "Em que século Machado de Assis escreveu a maioria de suas obras?",
        options: ["XVII", "XVIII", "XIX", "XX"],
        correct: 2
    },
    {
        question: "Qual é o nome da mãe de Bento Santiago em Dom Casmurro?",
        options: ["Dona Maria", "Dona Fortunata", "Dona Patrocínio", "Dona Eugênia"],
        correct: 2
    },
    {
        question: "O que levou Dom Casmurro a construir uma réplica de sua antiga rua no Rio de Janeiro?",
        options: ["Fuga da realidade", "Saudade do passado", "Loucura", "Punição de Capitu"],
        correct: 1
    },
    {
        question: "Qual movimento literário Machado de Assis pertencia?",
        options: ["Romantismo", "Modernismo", "Realismo", "Naturalismo"],
        correct: 2
    },
    {
        question: "Em que cidade Machado de Assis nasceu?",
        options: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia"],
        correct: 1
    },
    {
        question: "Qual é a profissão de Bento Santiago antes de conhecer Capitu?",
        options: ["Advogado", "Comerciante", "Estudante de seminário", "Professor"],
        correct: 2
    }
];

// ===== VARIÁVEIS DO JOGO =====
let currentQuestion = 0;
let playerScore = 0;
let playerName = '';
let answered = false;
let gameActive = true;

// ===== ELEMENTOS DO DOM =====
const initialScreen = document.getElementById('initialScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const nameForm = document.getElementById('nameForm');
const playerNameInput = document.getElementById('playerName');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextButton = document.getElementById('nextButton');
const progressFill = document.getElementById('progressFill');
const questionCounter = document.getElementById('questionCounter');
const finalScore = document.getElementById('finalScore');
const playerResult = document.getElementById('playerResult');
const resultMessage = document.getElementById('resultMessage');
const rankingBody = document.getElementById('rankingBody');
const restartButton = document.getElementById('restartButton');

// ===== EVENT LISTENERS =====
nameForm.addEventListener('submit', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartGame);

// ===== FUNÇÕES PRINCIPAIS =====

/**
 * Inicia o quiz após o usuário inserir seu nome
 */
function startQuiz(e) {
    e.preventDefault();
    playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        alert('Por favor, digite seu nome!');
        return;
    }

    // Transição de telas
    initialScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    
    playerNameDisplay.textContent = playerName;
    currentQuestion = 0;
    playerScore = 0;
    answered = false;

    loadQuestion();
}

/**
 * Carrega a pergunta atual e suas opções
 */
function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        finishQuiz();
        return;
    }

    // Atualiza header
    playerNameDisplay.textContent = playerName;
    scoreDisplay.textContent = `Pontos: ${playerScore}`;
    
    const question = quizQuestions[currentQuestion];
    questionText.textContent = question.question;
    
    // Atualiza progresso
    updateProgress();
    updateCounter();

    // Limpa e carrega opções
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'btn option-btn';
        optionBtn.textContent = option;
        optionBtn.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionBtn);
    });

    answered = false;
    nextButton.disabled = true;
}

/**
 * Seleciona uma resposta e fornece feedback
 */
function selectAnswer(selectedIndex) {
    if (answered) return;
    
    answered = true;
    const question = quizQuestions[currentQuestion];
    const optionButtons = document.querySelectorAll('.option-btn');
    
    // Desativa todos os botões
    optionButtons.forEach((btn, index) => {
        btn.disabled = true;
    });

    // Mostra resposta correta
    const correctBtn = optionButtons[question.correct];
    correctBtn.classList.add('correct');

    // Verifica se acertou
    if (selectedIndex === question.correct) {
        playerScore += 10;
        scoreDisplay.textContent = `Pontos: ${playerScore}`;
    } else {
        const selectedBtn = optionButtons[selectedIndex];
        selectedBtn.classList.add('incorrect');
    }

    // Habilita próximo botão com delay
    setTimeout(() => {
        nextButton.disabled = false;
    }, 500);
}

/**
 * Vai para a próxima pergunta
 */
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        finishQuiz();
    } else {
        loadQuestion();
    }
}

/**
 * Finaliza o quiz e mostra resultado
 */
function finishQuiz() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    finalScore.textContent = playerScore;
    playerResult.textContent = `Parabéns, ${playerName}!`;

    // Define mensagem baseada na pontuação
    const percentage = (playerScore / (quizQuestions.length * 10)) * 100;
    let message = '';

    if (percentage === 100) {
        message = '🌟 Perfeito! Você é um especialista em Machado de Assis!';
    } else if (percentage >= 80) {
        message = '🎉 Excelente! Você conhece muito sobre o autor!';
    } else if (percentage >= 60) {
        message = '👍 Bom trabalho! Você tem bom conhecimento sobre Machado.';
    } else if (percentage >= 40) {
        message = '📚 Legal! Você pode aprender mais sobre Machado de Assis.';
    } else {
        message = '💡 Continue estudando! Machado de Assis tem obras incríveis!';
    }

    resultMessage.textContent = message;

    // Salva resultado no localStorage
    saveToRanking(playerName, playerScore);
    
    // Mostra ranking
    displayRanking();
}

/**
 * Salva o resultado no ranking localStorage (Top 5)
 */
function saveToRanking(name, score) {
    // Recupera ranking existente
    let ranking = JSON.parse(localStorage.getItem('quizRanking')) || [];

    // Adiciona novo resultado
    ranking.push({ name, score, date: new Date().toLocaleDateString('pt-BR') });

    // Ordena por pontuação decrescente
    ranking.sort((a, b) => b.score - a.score);

    // Mantém apenas top 5
    ranking = ranking.slice(0, 5);

    // Salva no localStorage
    localStorage.setItem('quizRanking', JSON.stringify(ranking));
}

/**
 * Exibe o ranking na tabela
 */
function displayRanking() {
    const ranking = JSON.parse(localStorage.getItem('quizRanking')) || [];
    rankingBody.innerHTML = '';

    if (ranking.length === 0) {
        rankingBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">Nenhum resultado ainda</td></tr>';
        return;
    }

    ranking.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${index + 1}°</strong></td>
            <td>${entry.name}</td>
            <td><strong>${entry.score}</strong></td>
        `;
        rankingBody.appendChild(row);
    });
}

/**
 * Reinicia o jogo
 */
function restartGame() {
    currentQuestion = 0;
    playerScore = 0;
    answered = false;
    playerNameInput.value = '';

    resultScreen.classList.add('hidden');
    initialScreen.classList.remove('hidden');
    playerNameInput.focus();
}

/**
 * Atualiza a barra de progresso
 */
function updateProgress() {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = progress + '%';
}

/**
 * Atualiza o contador de perguntas
 */
function updateCounter() {
    questionCounter.textContent = `${currentQuestion + 1}/${quizQuestions.length}`;
}

// ===== INICIALIZAÇÃO =====
// Foca no input de nome ao carregar
playerNameInput.focus();
