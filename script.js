document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timeElement = document.getElementById('time');
    const testsElement = document.getElementById('tests');
    const testsLabel = document.getElementById('testsLabel');
    const restartBtn = document.getElementById('restartBtn');
    const timeSelect = document.getElementById('timeSelect');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const yearElement = document.getElementById('year');
    const arBtn = document.getElementById('arBtn');
    const enBtn = document.getElementById('enBtn');
    const modeText = document.getElementById('modeText');
    const resultsHistory = document.getElementById('resultsHistory');
    const arHistory = document.getElementById('arHistory');
    const enHistory = document.getElementById('enHistory');
    const resultPopup = document.getElementById('resultPopup');
    const resultWpm = document.getElementById('resultWpm');
    const resultAccuracy = document.getElementById('resultAccuracy');
    const resultLang = document.getElementById('resultLang');
    const resultTitle = document.getElementById('resultTitle');
    const historyTitle = document.getElementById('historyTitle');
    const closePopup = document.getElementById('closePopup');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Variables
    let timer;
    let timeLeft;
    let isTyping = false;
    let startTime;
    let totalTyped = 0;
    let correctTyped = 0;
    let currentText = '';
    let currentIndex = 0;
    let currentLanguage = 'ar';
    let totalTests = 0;
    let testHistory = {
        ar: [],
        en: []
    };

    // Texts for typing
    const texts = {
        ar: [
            "التعلم هو بداية الطريق نحو النجاح، والمثابرة هي سر الوصول إلى القمة.",
            "لا تنتظر الفرصة، بل اصنعها بنفسك من خلال العمل الجاد والإصرار على النجاح.",
            "التحديات تصنع الشخصية القوية، فلا تخف من الصعوبات بل استقبلها بثقة.",
            "القراءة هي غذاء العقل، والكتابة هي وسيلة للتعبير عن الأفكار والإبداع.",
            "الوقت كالسيف إن لم تقطعه قطعك، فاستثمر وقتك في ما ينفعك ويطور من مهاراتك.",
            "الإنسان الناجح هو الذي يستطيع أن يحول الصعوبات إلى فرص للتطور والنمو.",
            "الثقة بالنفس هي أول خطوات النجاح، والإيمان بالقدرات هو ما يدفعك للأمام.",
            "العلم في الصغر كالنقش على الحجر، فابدأ في تطوير نفسك من الآن ولا تؤجل التعلم.",
            "اللغة العربية هي لغة الضاد، وهي من أروع اللغات التي تحتوي على مفردات غنية ومعاني عميقة.",
            "التكنولوجيا الحديثة غيرت طريقة تعلمنا وعملنا، فلنستفد منها في تطوير مهاراتنا."
        ],
        en: [
            "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
            "Programming is the art of telling another human what one wants the computer to do. Learning to code opens many doors.",
            "Practice makes perfect. Consistent effort over time leads to mastery in any skill, including typing.",
            "The only way to learn a new programming language is by writing programs in it. The same applies to typing skills.",
            "Technology is best when it brings people together. The internet connects us all in ways never before possible.",
            "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
            "The future belongs to those who believe in the beauty of their dreams. Keep practicing and never give up.",
            "In the middle of every difficulty lies opportunity. Challenges help us grow and improve our abilities.",
            "Your time is limited, so don't waste it living someone else's life. Focus on improving yourself every day.",
            "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
        ]
    };

    // Initialize copyright year
    yearElement.textContent = new Date().getFullYear();

    // Load saved data
    function loadData() {
        const savedData = localStorage.getItem('ruslanTypeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            testHistory = data.testHistory || { ar: [], en: [] };
            totalTests = data.totalTests || 0;
            currentLanguage = data.language || 'ar';
            
            if (data.darkMode) {
                darkModeToggle.checked = true;
                document.body.setAttribute('data-theme', 'dark');
                modeText.textContent = currentLanguage === 'ar' ? 'الوضع النهاري' : 'Light Mode';
            }
            
            updateTestsCount();
            renderHistory();
        }
    }

    // Save data
    function saveData() {
        const data = {
            testHistory,
            totalTests,
            language: currentLanguage,
            darkMode: darkModeToggle.checked
        };
        localStorage.setItem('ruslanTypeData', JSON.stringify(data));
    }

    // Update tests count
    function updateTestsCount() {
        testsElement.textContent = totalTests;
        testsLabel.textContent = currentLanguage === 'ar' ? 'اختبارات' : 'Tests';
    }

    // Switch language
    function switchLanguage(lang) {
        currentLanguage = lang;
        
        if (lang === 'ar') {
            document.documentElement.lang = 'ar';
            document.documentElement.dir = 'rtl';
            arBtn.classList.add('active');
            enBtn.classList.remove('active');
            textInput.placeholder = "اضغط هنا لبدء الكتابة...";
            restartBtn.textContent = "إعادة";
            modeText.textContent = darkModeToggle.checked ? "الوضع النهاري" : "الوضع الليلي";
            timeSelect.innerHTML = `
                <option value="30">30 ثانية</option>
                <option value="60">60 ثانية</option>
                <option value="90" selected>90 ثانية</option>
                <option value="120">120 ثانية</option>
            `;
            testsLabel.textContent = "اختبارات";
            resultTitle.textContent = "نتيجة الاختبار";
            historyTitle.textContent = "سجل النتائج";
        } else {
            document.documentElement.lang = 'en';
            document.documentElement.dir = 'ltr';
            enBtn.classList.add('active');
            arBtn.classList.remove('active');
            textInput.placeholder = "Click here to start typing...";
            restartBtn.textContent = "Restart";
            modeText.textContent = darkModeToggle.checked ? "Light Mode" : "Dark Mode";
            timeSelect.innerHTML = `
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="90" selected>90 seconds</option>
                <option value="120">120 seconds</option>
            `;
            testsLabel.textContent = "Tests";
            resultTitle.textContent = "Test Result";
            historyTitle.textContent = "Results History";
        }
        
        textDisplay.classList.toggle('english', lang === 'en');
        textInput.classList.toggle('english', lang === 'en');
        
        updateTestsCount();
        restartTest();
        saveData();
    }

    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        document.body.setAttribute('data-theme', this.checked ? 'dark' : 'light');
        if (currentLanguage === 'ar') {
            modeText.textContent = this.checked ? 'الوضع النهاري' : 'الوضع الليلي';
        } else {
            modeText.textContent = this.checked ? 'Light Mode' : 'Dark Mode';
        }
        saveData();
    });

    // Language buttons events
    arBtn.addEventListener('click', () => switchLanguage('ar'));
    enBtn.addEventListener('click', () => switchLanguage('en'));

    // Load preferences
    loadData();

    // Start test
    function startTest() {
        isTyping = true;
        startTime = new Date();
        timeLeft = parseInt(timeSelect.value);
        updateTimer();
        timer = setInterval(updateTimer, 1000);
        
        // Select random text
        currentText = texts[currentLanguage][Math.floor(Math.random() * texts[currentLanguage].length)];
        renderText();
    }

    // Render text with character highlighting
    function renderText() {
        let html = '';
        for (let i = 0; i < currentText.length; i++) {
            let char = currentText[i];
            let className = '';
            
            if (i < currentIndex) {
                className = textInput.value[i] === char ? 'correct' : 'incorrect';
            } else if (i === currentIndex) {
                className = 'current';
            }
            
            html += `<span class="${className}">${char}</span>`;
        }
        textDisplay.innerHTML = html;
        
        // Calculate accuracy
        if (currentIndex > 0) {
            const accuracy = Math.round((correctTyped / currentIndex) * 100);
            accuracyElement.textContent = accuracy;
        }
    }

    // Update timer
    function updateTimer() {
        timeElement.textContent = timeLeft;
        timeLeft--;
        
        if (timeLeft < 0) {
            finishTest();
        }
    }

    // Finish test
    function finishTest() {
        clearInterval(timer);
        isTyping = false;
        textInput.disabled = true;
        
        const endTime = new Date();
        const timeDiff = (endTime - startTime) / 1000; // in seconds
        const minutes = timeDiff / 60;
        const words = (totalTyped / 5); // average word length is 5 characters
        const wpm = Math.round(words / minutes);
        const accuracy = Math.round((correctTyped / totalTyped) * 100);
        
        wpmElement.textContent = wpm;
        accuracyElement.textContent = accuracy;
        
        // Save result
        saveResult(wpm, accuracy);
        
        // Show result
        showResult(wpm, accuracy);
    }

    // Save result to history
    function saveResult(wpm, accuracy) {
        totalTests++;
        const result = {
            wpm,
            accuracy,
            date: new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US'),
            language: currentLanguage
        };
        
        testHistory[currentLanguage].unshift(result);
        if (testHistory[currentLanguage].length > 10) {
            testHistory[currentLanguage].pop();
        }
        
        updateTestsCount();
        renderHistory();
        saveData();
    }

    // Render history
    function renderHistory() {
        // Arabic history
        arHistory.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>التاريخ</th>
                        <th>السرعة (ك/د)</th>
                        <th>الدقة</th>
                    </tr>
                </thead>
                <tbody>
                    ${testHistory.ar.map(test => `
                        <tr>
                            <td>${test.date}</td>
                            <td>${test.wpm}</td>
                            <td>${test.accuracy}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // English history
        enHistory.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Speed (WPM)</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    ${testHistory.en.map(test => `
                        <tr>
                            <td>${test.date}</td>
                            <td>${test.wpm}</td>
                            <td>${test.accuracy}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Show test result
    function showResult(wpm, accuracy) {
        resultWpm.textContent = wpm;
        resultAccuracy.textContent = accuracy;
        resultLang.textContent = currentLanguage === 'ar' ? 'العربية' : 'English';
        resultsHistory.classList.remove('hidden');
        resultPopup.classList.remove('hidden');
    }

    // Close result popup
    closePopup.addEventListener('click', function() {
        resultPopup.classList.add('hidden');
        restartTest();
    });

    // Restart test
    function restartTest() {
        clearInterval(timer);
        isTyping = false;
        textInput.disabled = false;
        textInput.value = '';
        currentIndex = 0;
        totalTyped = 0;
        correctTyped = 0;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0';
        timeLeft = parseInt(timeSelect.value);
        timeElement.textContent = timeLeft;
        textInput.focus();
    }

    // Change test time
    timeSelect.addEventListener('change', restartTest);

    // Restart button
    restartBtn.addEventListener('click', restartTest);

    // Typing events
    textInput.addEventListener('input', function(e) {
        if (!isTyping && currentIndex === 0) {
            startTest();
        }
        
        const inputText = e.target.value;
        const currentChar = currentText[currentIndex];
        
        if (inputText.length > currentIndex) {
            // Check typed character
            const typedChar = inputText[currentIndex];
            if (typedChar === currentChar) {
                correctTyped++;
            }
            
            currentIndex++;
            totalTyped++;
            
            // Calculate typing speed
            const timeDiff = (new Date() - startTime) / 1000 / 60; // in minutes
            const words = (totalTyped / 5);
            const wpm = Math.round(words / timeDiff);
            wpmElement.textContent = wpm;
            
            // If reached end of text, select new text
            if (currentIndex >= currentText.length) {
                currentText = texts[currentLanguage][Math.floor(Math.random() * texts[currentLanguage].length)];
                currentIndex = 0;
                e.target.value = '';
            }
        } else {
            currentIndex = inputText.length;
        }
        
        renderText();
    });

    // History tabs switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.history-table').forEach(t => t.classList.add('hidden'));
            document.getElementById(`${lang}History`).classList.remove('hidden');
        });
    });

    // Initial setup
    textInput.focus();
    switchLanguage(currentLanguage);
});