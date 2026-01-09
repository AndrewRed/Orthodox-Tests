class UIController {
    constructor() {
        this.questionContainer = document.getElementById('questionContainer');
        this.resultContainer = document.getElementById('resultContainer');
        this.progressFill = document.getElementById('progressFill');
    }

    renderQuestion(question, questionNumber, totalQuestions) {
        const html = `
            <div class="question-number">Вопрос ${questionNumber} из ${totalQuestions}</div>
            <div class="question-text">${question.text}</div>
            <div class="answers" id="answersList">
                ${question.options.map((option, index) => `
                    <div class="answer-option" data-index="${index}">
                        <input type="radio" name="answer" value="${index}" id="answer${index}">
                        <label for="answer${index}">${option}</label>
                    </div>
                `).join('')}
            </div>
        `;
        this.questionContainer.innerHTML = html;
        this.questionContainer.style.display = 'block';

        // Добавляем обработчики для выбора ответа
        const answerOptions = this.questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
                answerOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    showAnswerResult(isCorrect, correctText, correctIndex) {
        const resultHtml = `
            <div class="answer-result ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✅ Правильно!' : `❌ Неправильно. Правильный ответ: ${correctText}`}
            </div>
        `;
        this.questionContainer.insertAdjacentHTML('beforeend', resultHtml);

        // Подсвечиваем правильный и неправильный ответы
        const answerOptions = this.questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            const index = parseInt(option.dataset.index);
            const radio = option.querySelector('input[type="radio"]');
            if (radio && radio.checked) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }
            // Показываем правильный ответ
            if (index === correctIndex) {
                option.classList.add('correct');
            }
        });
    }

    updateProgress(current, total, percentage) {
        this.progressFill.style.width = `${percentage}%`;
        this.progressFill.textContent = `Вопрос ${current} из ${total}`;
    }

    showFinalResults(results) {
        this.questionContainer.style.display = 'none';
        
        const resultsHtml = `
            <div class="results-header">
                <div class="score">${results.correct}/${results.total}</div>
                <div class="score-text">Правильных ответов</div>
                <div class="score-text">${results.percentage}%</div>
                <div class="score-grade ${results.grade}">${results.gradeText}</div>
            </div>
            <div class="results-details">
                ${results.answers.map((answer, index) => `
                    <div class="result-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <div class="result-question">Вопрос ${index + 1}: ${answer.questionText}</div>
                        <div class="result-answer">
                            Ваш ответ: ${answer.options[answer.selectedAnswer]}
                            ${!answer.isCorrect ? `<br><span class="correct-answer">Правильный ответ: ${answer.options[answer.correctAnswer]}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.resultContainer.innerHTML = resultsHtml;
        this.resultContainer.classList.add('show');
    }

    clearAnswerResult() {
        const resultDiv = this.questionContainer.querySelector('.answer-result');
        if (resultDiv) {
            resultDiv.remove();
        }
    }

    hideQuestion() {
        this.questionContainer.style.display = 'none';
    }
}

