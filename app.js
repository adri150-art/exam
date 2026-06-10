// --- Theme management ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        document.querySelector('.theme-icon').textContent = '🌙';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        document.querySelector('.theme-icon').textContent = '☀️';
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-icon').textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        document.querySelector('.theme-icon').textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// --- Tabs Switcher ---
function switchTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active-tab');
    });

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected
    const activeContent = document.getElementById(tabId);
    if (activeContent) {
        activeContent.classList.add('active-tab');
    }

    // Set active button
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// --- Study Controls (Toggle Details) ---
function toggleAllDetails(sectionId, state) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const details = section.querySelectorAll('details');
    details.forEach(item => {
        if (state) {
            item.setAttribute('open', '');
        } else {
            item.removeAttribute('open');
        }
    });
}

// --- Live Search ---
function filterContent() {
    const query = document.getElementById('global-search').value.toLowerCase().trim();
    
    // Select all details elements, timeline nodes, and table rows to search
    const detailsItems = document.querySelectorAll('.interactive-details');
    const timelineItems = document.querySelectorAll('.timeline-col');
    const tableRows = document.querySelectorAll('tbody tr');
    
    if (query === "") {
        // Clear all filters
        detailsItems.forEach(item => {
            item.classList.remove('hidden-search-item');
            item.removeAttribute('open'); // optionally close details when search is empty
        });
        timelineItems.forEach(item => item.classList.remove('hidden-search-item'));
        tableRows.forEach(item => item.classList.remove('hidden-search-item'));
        return;
    }

    // Filter details items (Accordions & Concepts)
    detailsItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.classList.remove('hidden-search-item');
            item.setAttribute('open', ''); // Auto-expand matching elements
        } else {
            item.classList.add('hidden-search-item');
            item.removeAttribute('open');
        }
    });

    // Filter timeline columns
    timelineItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.classList.remove('hidden-search-item');
        } else {
            item.classList.add('hidden-search-item');
        }
    });

    // Filter table rows
    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
            row.classList.remove('hidden-search-item');
        } else {
            row.classList.add('hidden-search-item');
        }
    });
}

// --- Century Calculator ---
function numberToRoman(num) {
    if (num <= 0) return '';
    const romanMap = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];
    let result = '';
    for (let i = 0; i < romanMap.length; i++) {
        while (num >= romanMap[i].value) {
            result += romanMap[i].symbol;
            num -= romanMap[i].value;
        }
    }
    return result;
}

function calculateCentury() {
    const inputVal = document.getElementById('year-input').value;
    const resultBox = document.getElementById('century-result');
    
    if (!inputVal) {
        resultBox.innerHTML = '<span class="result-text">Entrez une année ci-dessus...</span>';
        return;
    }

    const year = parseInt(inputVal);
    
    if (year === 0) {
        resultBox.innerHTML = '<span class="result-text" style="color: var(--error)">L\'an 0 n\'existe pas dans le calendrier historique chrétien !</span>';
        return;
    }

    const isBCE = year < 0;
    const absYear = Math.abs(year);
    
    // Formula for century calculation:
    // If year ends with 00 (e.g. 1500), it belongs to that century (1500 -> 15th).
    // Otherwise, we take floor(year / 100) + 1.
    let centuryNumber;
    let explanation;
    
    if (absYear % 100 === 0) {
        centuryNumber = absYear / 100;
        explanation = `L'année se termine par "00", on divise donc simplement par 100 : <br><strong>${absYear} / 100 = ${centuryNumber}</strong>.`;
    } else {
        centuryNumber = Math.floor(absYear / 100) + 1;
        explanation = `L'année ne se termine pas par "00", on ignore les deux derniers chiffres (${absYear % 100}) et on ajoute 1 : <br><strong>${Math.floor(absYear / 100)} + 1 = ${centuryNumber}</strong>.`;
    }

    const romanCentury = numberToRoman(centuryNumber);
    const suffix = centuryNumber === 1 ? 'er' : 'e';
    const eraText = isBCE ? ' avant J.-C.' : '';

    resultBox.innerHTML = `
        <div class="result-text" style="font-size: 1.3rem; margin-bottom: 0.5rem; color: var(--accent-primary)">
            ${romanCentury}<sup>${suffix}</sup> siècle${eraText}
        </div>
        <div class="result-subtext" style="font-size: 0.85rem; color: var(--text-secondary)">
            ${explanation}
        </div>
    `;
}

// --- Reliability Scorer ---
function evaluateReliability() {
    const authorScore = parseInt(document.getElementById('crit-author').value);
    const intentScore = parseInt(document.getElementById('crit-intent').value);
    const formScore = parseInt(document.getElementById('crit-form').value);
    const contentScore = parseInt(document.getElementById('crit-content').value);
    
    const totalScore = authorScore + intentScore + formScore + contentScore;
    const resultBox = document.getElementById('reliability-result');
    
    let label = '';
    let className = '';
    let explanation = '';

    if (totalScore >= 10) {
        label = 'Très Fiable / Hautement crédible';
        className = 'reliable';
        explanation = 'Le document réunit d\'excellentes garanties d\'objectivité, de maîtrise du sujet et de vérifiabilité.';
    } else if (totalScore >= 6) {
        label = 'Fiabilité Modérée / À utiliser avec prudence';
        className = 'neutral';
        explanation = 'Certains biais ou faiblesses méthodologiques sont présents. Croisez-le avec d\'autres sources.';
    } else {
        label = 'Peu Fiable / Suspect / Potentielle propagande';
        className = 'unreliable';
        explanation = 'Nombreux indicateurs négatifs (absence d\'auteur qualifié, but commercial ou partisan évident, affirmation non vérifiée).';
    }

    resultBox.className = `result-box reliability-badge ${className}`;
    resultBox.innerHTML = `
        <strong>Score : ${totalScore} / 12 (${label})</strong><br>
        <span class="result-subtext" style="font-size: 0.85rem; margin-top: 0.25rem; display: block;">
            ${explanation}
        </span>
    `;
}


// --- QCM Engine ---
function initQCMEvents() {
    const options = document.querySelectorAll('.qcm-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            // Empêcher de changer la réponse si le QCM a déjà été validé
            if (this.closest('.qcm-item').classList.contains('locked')) return;

            // Retirer la sélection précédente dans la même question
            const siblings = this.parentElement.children;
            for (let sibling of siblings) {
                sibling.classList.remove('selected');
            }
            // Ajouter la sélection à l'élément cliqué
            this.classList.add('selected');
        });
    });
}

function calculateScore() {
    const questions = document.querySelectorAll('.qcm-item');
    let score = 0;
    let answeredCount = 0;

    questions.forEach(question => {
        const correctAnswerIdx = question.getAttribute('data-answer');
        const selectedOption = question.querySelector('.qcm-option.selected');
        const explanation = question.querySelector('.qcm-explanation');

        // Verrouiller la question
        question.classList.add('locked');
        
        // Si une option est sélectionnée
        if (selectedOption) {
            answeredCount++;
            const selectedIdx = selectedOption.getAttribute('data-idx');
            
            // Si la réponse est correcte
            if (selectedIdx === correctAnswerIdx) {
                score++;
                selectedOption.classList.add('correct');
            } else {
                // Si incorrecte
                selectedOption.classList.add('incorrect');
                // Mettre en évidence la bonne réponse
                const correctElement = question.querySelector(`.qcm-option[data-idx="${correctAnswerIdx}"]`);
                correctElement.classList.add('correct');
            }
        } else {
            // Si non répondu, montrer la bonne réponse
            const correctElement = question.querySelector(`.qcm-option[data-idx="${correctAnswerIdx}"]`);
            correctElement.classList.add('correct');
        }

        // Afficher l'explication didactique
        explanation.style.display = 'block';
    });

    // Affichage du résultat final
    const resultDiv = document.getElementById('qcm-result');
    resultDiv.style.display = 'block';
    
    if (answeredCount < 20) {
        resultDiv.innerHTML = `Vous avez obtenu ${score} / 20. <br><span style="font-size:0.8em; font-weight:normal;">(Attention, vous n'aviez pas répondu à toutes les questions).</span>`;
    } else {
        resultDiv.innerHTML = `Score final : ${score} / 20 !`;
    }

    // Coloration en fonction de la performance
    resultDiv.className = 'result-box'; // reset classes
    if (score >= 16) {
        resultDiv.classList.add('score-high');
        resultDiv.innerHTML += "<br>Excellent travail ! Vous maîtrisez parfaitement la synthèse U1207.";
    } else if (score >= 10) {
        resultDiv.classList.add('score-medium');
        resultDiv.innerHTML += "<br>Bon travail, mais quelques révisions sur les détails sont encore nécessaires.";
    } else {
        resultDiv.classList.add('score-low');
        resultDiv.innerHTML += "<br>Il va falloir relire le cours plus attentivement. Accrochez-vous !";
    }

    // Smooth scroll to the result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetQuiz() {
    const questions = document.querySelectorAll('.qcm-item');
    questions.forEach(question => {
        question.classList.remove('locked');
        
        const options = question.querySelectorAll('.qcm-option');
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        const explanation = question.querySelector('.qcm-explanation');
        explanation.style.display = 'none';
    });

    const resultDiv = document.getElementById('qcm-result');
    resultDiv.style.display = 'none';
    resultDiv.className = 'result-box';
    resultDiv.innerHTML = '';
}


// --- App Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    evaluateReliability(); // Load initial value for form
    initQCMEvents();
    
    // Scroll handling for smooth somatic anchors
    document.querySelectorAll('.sidebar-sommaire a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Auto switch tabs based on target section
            if (targetId.startsWith('part1')) {
                switchTab('part1');
            } else if (targetId.startsWith('part2')) {
                switchTab('part2');
            } else if (targetId.startsWith('part3')) {
                switchTab('part3');
            }
            
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    });
});

