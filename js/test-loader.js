class TestLoader {
    constructor() {
        this.testsList = null;
    }

    async loadTestsList() {
        try {
            const response = await fetch('data/tests-list.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.testsList = data.tests;
            return this.testsList;
        } catch (error) {
            console.error('Ошибка загрузки списка тестов:', error);
            throw error;
        }
    }

    async loadTest(testId) {
        try {
            const testInfo = this.testsList.find(t => t.id === testId);
            if (!testInfo) {
                throw new Error(`Тест с id "${testId}" не найден`);
            }

            const response = await fetch(testInfo.file);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const testData = await response.json();
            return testData;
        } catch (error) {
            console.error('Ошибка загрузки теста:', error);
            throw error;
        }
    }

    getTestInfo(testId) {
        if (!this.testsList) {
            return null;
        }
        return this.testsList.find(t => t.id === testId);
    }
}

