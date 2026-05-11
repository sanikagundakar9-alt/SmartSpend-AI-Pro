let myChart;
let expenseData = JSON.parse(localStorage.getItem('expenses')) || [];

window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerText = "☀️ Light Mode";
    }
    updateChart();
    giveAIInsight();
};

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-toggle').innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateChart(); // Chart colors refresh karnyasaathi
}

function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    if (!amount || amount <= 0) return;

    expenseData.push({ amount, category });
    localStorage.setItem('expenses', JSON.stringify(expenseData));
    
    updateChart();
    giveAIInsight();
    document.getElementById('amount').value = "";
}

function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const summary = {};
    expenseData.forEach(item => summary[item.category] = (summary[item.category] || 0) + item.amount);

    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(summary),
            datasets: [{
                data: Object.values(summary),
                backgroundColor: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
            }]
        },
        options: {
            plugins: {
                legend: { labels: { color: document.body.classList.contains('dark-mode') ? 'white' : 'black' } }
            }
        }
    });
}

function giveAIInsight() {
    const insightDiv = document.getElementById('ai-insight');
    if (expenseData.length === 0) return;
    const last = expenseData[expenseData.length - 1];
    insightDiv.innerText = last.amount > 5000 ? `AI Alert: ${last.category} var jast kharch hotoय!` : "AI Insight: Kharch control madhe aahe.";
}

function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        const num = text.match(/\d+/);
        if (num) {
            document.getElementById('amount').value = num[0];
            alert("Recognized: " + text);
        }
    };
    recognition.start();
}