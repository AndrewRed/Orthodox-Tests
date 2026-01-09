const testLoader = new TestLoader();

document.addEventListener('DOMContentLoaded', async () => {
    const testsContainer = document.getElementById('testsContainer');
    const loading = document.getElementById('loading');

    loading.classList.add('show');

    try {
        const tests = await testLoader.loadTestsList();
        loading.classList.remove('show');
        renderTests(tests);
    } catch (error) {
        console.error('Ошибка загрузки тестов:', error);
        loading.textContent = 'Ошибка загрузки тестов. Попробуйте обновить страницу.';
    }
});

function renderTests(tests) {
    const testsContainer = document.getElementById('testsContainer');
    testsContainer.innerHTML = '';

    tests.forEach(test => {
        const testCard = createTestCard(test);
        testsContainer.appendChild(testCard);
    });
}

function createTestCard(test) {
    const card = document.createElement('div');
    card.className = 'test-card';
    
    const img = document.createElement('img');
    img.src = test.icon;
    img.alt = test.title;
    img.onerror = function() {
        this.src = 'data/voskreshenie-lazarya/images/Владимирская.png'; // Fallback иконка
    };

    const title = document.createElement('h3');
    title.textContent = test.title;

    const description = document.createElement('p');
    description.textContent = test.description;

    const questionCountSelector = document.createElement('div');
    questionCountSelector.className = 'question-count-selector';
    
    const label = document.createElement('label');
    label.textContent = 'Количество вопросов:';
    
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    
    const counts = [5, 10, 15, 'all'];
    counts.forEach(count => {
        const radioDiv = document.createElement('div');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `count_${test.id}`;
        radio.value = count;
        radio.id = `count_${test.id}_${count}`;
        if (count === 10) {
            radio.checked = true;
        }
        
        const radioLabel = document.createElement('label');
        radioLabel.htmlFor = `count_${test.id}_${count}`;
        radioLabel.textContent = count === 'all' ? 'Все вопросы' : `${count} вопросов`;
        
        radioDiv.appendChild(radio);
        radioDiv.appendChild(radioLabel);
        radioGroup.appendChild(radioDiv);
    });

    label.appendChild(radioGroup);
    questionCountSelector.appendChild(label);

    const startBtn = document.createElement('button');
    startBtn.className = 'start-test-btn';
    startBtn.textContent = 'Начать тест';
    
    startBtn.addEventListener('click', () => {
        const selectedCount = document.querySelector(`input[name="count_${test.id}"]:checked`).value;
        window.location.href = `test.html?test=${test.id}&count=${selectedCount}`;
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(questionCountSelector);
    card.appendChild(startBtn);

    return card;
}

