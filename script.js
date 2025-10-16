document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu Mobile Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        });
    });

    // 2. Simple Add to Cart Logic
    const buyButtons = document.querySelectorAll('.product-card button');

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productName = button.closest('.product-card').querySelector('h3').textContent;
            alert(`"${productName}" added to cart! Thank you for choosing Yb.`);
        });
    });

    // 3. Highlight active page in navigation
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // 4. Smooth Scrolling for internal links (optional, if you want it)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 5. Quiz Logic (for quiz.html)
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        const quizQuestions = [
            {
                question: "What is your primary skin concern?",
                options: ["Hydration & Dryness", "Acne & Blemishes", "Anti-Aging & Fine Lines", "Redness & Sensitivity", "Dullness & Uneven Tone"],
                type: "single"
            },
            {
                question: "How does your skin feel by midday?",
                options: ["Oily/Shiny", "Normal/Balanced", "Dry/Tight", "Combination (Oily T-zone, dry cheeks)"],
                type: "single"
            },
            {
                question: "What texture do you prefer for your skincare?",
                options: ["Lightweight gels/serums", "Rich creams/balms", "Foaming cleansers", "Oil-based"],
                type: "single"
            },
            {
                question: "Are you concerned about sun protection?",
                options: ["Yes, always!", "Sometimes", "Not really"],
                type: "single"
            },
            {
                question: "What ingredients are you interested in?",
                options: ["Hyaluronic Acid", "Vitamin C", "Retinol", "Niacinamide", "Salicylic Acid", "Peptides"],
                type: "multiple"
            }
        ];
        let currentQuestionIndex = 0;
        let userAnswers = [];

        const quizProgress = quizContainer.querySelector('.quiz-progress-bar');
        const quizQuestionElem = quizContainer.querySelector('.quiz-question');
        const quizOptionsElem = quizContainer.querySelector('.quiz-options');
        const prevBtn = quizContainer.querySelector('#quiz-prev-btn');
        const nextBtn = quizContainer.querySelector('#quiz-next-btn');

        function renderQuestion() {
            if (currentQuestionIndex < quizQuestions.length) {
                const q = quizQuestions[currentQuestionIndex];
                quizQuestionElem.textContent = q.question;
                quizOptionsElem.innerHTML = ''; // Clear previous options

                q.options.forEach(optionText => {
                    const button = document.createElement('button');
                    button.classList.add('cta-button', 'quiz-option');
                    button.textContent = optionText;
                    button.dataset.value = optionText; // Store value for selection

                    if (q.type === "single" && userAnswers[currentQuestionIndex] === optionText) {
                        button.classList.add('selected');
                    } else if (q.type === "multiple" && userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].includes(optionText)) {
                        button.classList.add('selected');
                    }

                    button.addEventListener('click', () => selectOption(q.type, optionText));
                    quizOptionsElem.appendChild(button);
                });

                updateNavigationButtons();
                updateProgressBar();
            } else {
                showResults();
            }
        }

        function selectOption(type, value) {
            if (type === "single") {
                userAnswers[currentQuestionIndex] = value;
                quizOptionsElem.querySelectorAll('.quiz-option').forEach(btn => {
                    btn.classList.remove('selected');
                });
                quizOptionsElem.querySelector(`[data-value="${value}"]`).classList.add('selected');
            } else if (type === "multiple") {
                if (!userAnswers[currentQuestionIndex]) {
                    userAnswers[currentQuestionIndex] = [];
                }
                const index = userAnswers[currentQuestionIndex].indexOf(value);
                const button = quizOptionsElem.querySelector(`[data-value="${value}"]`);

                if (index > -1) {
                    userAnswers[currentQuestionIndex].splice(index, 1);
                    button.classList.remove('selected');
                } else {
                    userAnswers[currentQuestionIndex].push(value);
                    button.classList.add('selected');
                }
            }
            updateNavigationButtons();
        }

        function updateNavigationButtons() {
            prevBtn.disabled = currentQuestionIndex === 0;
            const currentQuestion = quizQuestions[currentQuestionIndex];
            if (currentQuestion.type === "single") {
                nextBtn.disabled = !userAnswers[currentQuestionIndex];
            } else if (currentQuestion.type === "multiple") {
                 nextBtn.disabled = !(userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].length > 0);
            }
            nextBtn.textContent = (currentQuestionIndex === quizQuestions.length - 1) ? "See Results" : "Next";
        }

        function updateProgressBar() {
            const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
            quizProgress.style.width = `${progress}%`;
        }

        function showResults() {
            quizContainer.innerHTML = `
                <div class="quiz-results bounce-in">
                    <h3>Your Personalized Yb Routine!</h3>
                    <p>Based on your answers, here's a suggested routine tailored just for you. Explore these products to achieve your skin goals!</p>
                    <ul>
                        <li><strong>Concern:</strong> ${userAnswers[0]}</li>
                        <li><strong>Skin Feel:</strong> ${userAnswers[1]}</li>
                        <li><strong>Preference:</strong> ${userAnswers[2]}</li>
                        <li><strong>SPF Need:</strong> ${userAnswers[3]}</li>
                        <li><strong>Ingredients:</strong> ${userAnswers[4] ? userAnswers[4].join(', ') : 'N/A'}</li>
                    </ul>
                    <a href="shop.html" class="cta-button" style="margin-top: 20px;">Discover Your Products</a>
                    <button class="cta-button secondary-cta" style="margin-top: 15px;" onclick="location.reload()">Retake Quiz</button>
                </div>
            `;
        }

        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        });

        nextBtn.addEventListener('click', () => {
            const currentQuestion = quizQuestions[currentQuestionIndex];
            const hasAnswer = (currentQuestion.type === "single" && userAnswers[currentQuestionIndex]) ||
                              (currentQuestion.type === "multiple" && userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].length > 0);

            if (hasAnswer) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                alert("Please select an option before proceeding!");
            }
        });

        renderQuestion(); // Initial render
    }
});