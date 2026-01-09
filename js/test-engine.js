class TestEngine {
    constructor(questions, questionCount) {
        this.allQuestions = questions;
        this.questionCount = questionCount === 'all' ? questions.length : Math.min(questionCount, questions.length);
        this.selectedQuestions = this.selectQuestions();
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.isFinished = false;
    }

    selectQuestions() {
        const shuffled = [...this.allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, this.questionCount);
    }

    getCurrentQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            return null;
        }
        return this.selectedQuestions[this.currentQuestionIndex];
    }

    getNextQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            return null;
        }
        return this.selectedQuestions[this.currentQuestionIndex];
    }

    submitAnswer(questionId, answerIndex) {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        this.answers.push({
            questionId: question.id,
            questionText: question.text,
            selectedAnswer: answerIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            options: question.options
        });

        return {
            isCorrect: isCorrect,
            correctAnswer: question.correct,
            correctText: question.options[question.correct]
        };
    }

    moveToNext() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.isFinished = true;
        }
    }

    getProgress() {
        return {
            current: this.currentQuestionIndex + 1,
            total: this.selectedQuestions.length,
            percentage: Math.round(((this.currentQuestionIndex + 1) / this.selectedQuestions.length) * 100)
        };
    }

    getResults() {
        const correctCount = this.answers.filter(a => a.isCorrect).length;
        const totalCount = this.answers.length;
        const percentage = Math.round((correctCount / totalCount) * 100);
        
        let grade = 'needs-work';
        let gradeText = 'Нужно повторить';
        
        if (percentage >= 90) {
            grade = 'excellent';
            gradeText = 'Отлично!';
        } else if (percentage >= 70) {
            grade = 'good';
            gradeText = 'Хорошо!';
        }

        return {
            correct: correctCount,
            total: totalCount,
            percentage: percentage,
            grade: grade,
            gradeText: gradeText,
            answers: this.answers
        };
    }

    isTestFinished() {
        return this.isFinished;
    }
}

