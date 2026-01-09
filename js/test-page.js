const testLoader = new TestLoader();
let testEngine = null;
let uiController = null;
let currentTestData = null;

document.addEventListener('DOMContentLoaded', async () => {
    uiController = new UIController();
    
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('test');
    const questionCount = urlParams.get('count') || 'all';

    if (!testId) {
        alert('Тест не выбран!');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Загружаем список тестов
        await testLoader.loadTestsList();
        
        // Загружаем выбранный тест
        currentTestData = await testLoader.loadTest(testId);
        const testInfo = testLoader.getTestInfo(testId);

        // Устанавливаем заголовок
        document.getElementById('testTitle').textContent = testInfo.title;
        document.getElementById('testDescription').textContent = testInfo.description;

        // Создаем движок теста
        const count = questionCount === 'all' ? 'all' : parseInt(questionCount);
        testEngine = new TestEngine(currentTestData.questions, count);

        // Показываем первый вопрос
        showQuestion();

        // Настройка кнопок
        setupButtons();
    } catch (error) {
        console.error('Ошибка загрузки теста:', error);
        alert('Ошибка загрузки теста. Попробуйте еще раз.');
        window.location.href = 'index.html';
    }
});

function showQuestion() {
    const question = testEngine.getNextQuestion();
    if (!question) {
        finishTest();
        return;
    }

    answerSubmitted = false; // Сбрасываем флаг при показе нового вопроса

    const progress = testEngine.getProgress();
    uiController.renderQuestion(question, progress.current, progress.total);
    uiController.updateProgress(progress.current, progress.total, progress.percentage);

    // Скрываем кнопки и сбрасываем состояние
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'inline-block';
    nextBtn.textContent = 'Проверить ответ';
    document.getElementById('finishBtn').style.display = 'none';
}

let answerSubmitted = false;

function setupButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const restartBtn = document.getElementById('restartBtn');
    const backBtn = document.getElementById('backBtn');

    nextBtn.addEventListener('click', () => {
        if (!answerSubmitted) {
            // Первый клик - проверяем ответ
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            if (!selectedAnswer) {
                alert('Пожалуйста, выберите ответ!');
                return;
            }

            const answerIndex = parseInt(selectedAnswer.value);
            const result = testEngine.submitAnswer(null, answerIndex);
            
            uiController.showAnswerResult(result.isCorrect, result.correctText, result.correctAnswer);

            // Отключаем все радиокнопки
            document.querySelectorAll('input[name="answer"]').forEach(radio => {
                radio.disabled = true;
            });

            answerSubmitted = true;
            nextBtn.textContent = 'Следующий вопрос';
            nextBtn.style.display = 'inline-block';
        } else {
            // Второй клик - переходим к следующему вопросу
            testEngine.moveToNext();
            answerSubmitted = false;
            if (testEngine.isTestFinished()) {
                finishTest();
            } else {
                showQuestion();
            }
        }
    });

    finishBtn.addEventListener('click', () => {
        finishTest();
    });

    restartBtn.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const testId = urlParams.get('test');
        const questionCount = urlParams.get('count') || 'all';
        window.location.href = `test.html?test=${testId}&count=${questionCount}`;
    });

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function finishTest() {
    // Сохраняем последний ответ, если он был выбран
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer && testEngine.currentQuestionIndex < testEngine.selectedQuestions.length) {
        const answerIndex = parseInt(selectedAnswer.value);
        const result = testEngine.submitAnswer(null, answerIndex);
        uiController.showAnswerResult(result.isCorrect, result.correctText, result.correctAnswer);
        testEngine.moveToNext();
    }

    // Показываем результаты
    const results = testEngine.getResults();
    uiController.showFinalResults(results);

    // Скрываем кнопки
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('finishBtn').style.display = 'none';

    // Показываем кнопки для повторного прохождения
    document.getElementById('restartBtn').style.display = 'inline-block';
    document.getElementById('backBtn').style.display = 'inline-block';
}

