document.addEventListener('DOMContentLoaded', () => {
    // State Containers
    const stateUpload = document.getElementById('upload-state');
    const stateProcessing = document.getElementById('processing-state');
    const stateResult = document.getElementById('result-state');

    // Upload Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('video-upload');

    // Processing Elements
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Result Elements
    const resetBtn = document.getElementById('reset-btn');
    const ringProgress = document.getElementById('ring-progress');
    const scoreValue = document.getElementById('score-value');
    const resultCard = document.getElementById('result-card');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictDesc = document.getElementById('verdict-desc');
    const framesValue = document.getElementById('frames-value');
    const timeValue = document.getElementById('time-value');

    // Switch between states
    function switchState(targetState) {
        stateUpload.classList.remove('active');
        stateProcessing.classList.remove('active');
        stateResult.classList.remove('active');
        targetState.classList.add('active');
    }

    // Handle file selection
    function handleFile(file) {
        if (!file) return;

        // Basic validation
        if (!file.type.match('video.*')) {
            alert('Please select a valid video file.');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            alert('File size exceeds 50MB limit.');
            return;
        }

        // Start processing with real API
        processVideo(file);
    }

    // Drag and Drop Events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        switchState(stateUpload);
        // Reset score classes
        resultCard.className = 'result-card';
        ringProgress.style.strokeDashoffset = '251.2';
        scoreValue.innerText = '0';
    });

    // Process Video via Backend API
    function processVideo(file) {
        switchState(stateProcessing);
        let progress = 0;

        // Fake progress bar animation while waiting for backend
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 2;
            if (progress > 90) progress = 90; // Hold at 90%

            progressBar.style.width = `${progress}%`;
            progressText.innerText = `${progress}%`;
        }, 300);

        const formData = new FormData();
        formData.append('video', file);

        fetch('http://localhost:5000/api/analyze', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                clearInterval(interval);
                progressBar.style.width = `100%`;
                progressText.innerText = `100%`;

                setTimeout(() => {
                    displayResults(data.data);
                }, 800);
            })
            .catch(error => {
                console.error('Error:', error);
                clearInterval(interval);
                alert('Failed to connect to backend! Ensure the Node server is running on port 5000.');
                resetBtn.click();
            });
    }

    // Display Real Results from API
    function displayResults(data) {
        switchState(stateResult);

        const score = data.confidence_score;
        const isFake = data.prediction === 'Fake';

        // Circular progress logic
        const circumference = 2 * Math.PI * 40; // r=40
        const offset = circumference - (score / 100) * circumference;

        // Animate numbers
        let currentScore = 0;
        const scoreInterval = setInterval(() => {
            if (currentScore >= score) {
                clearInterval(scoreInterval);
                scoreValue.innerText = score;
            } else {
                currentScore++;
                scoreValue.innerText = currentScore;
            }
        }, 15);

        // Set UI based on threshold
        resultCard.className = 'result-card'; // Reset classes

        if (score >= 70) {
            resultCard.classList.add('status-fake');
            verdictTitle.innerText = 'AI-Generated Video';
            verdictTitle.style.color = 'var(--danger)';
            verdictDesc.innerText = 'High probability of deepfake or synthetic manipulation detected in spatial patterns.';
        } else if (score >= 40) {
            resultCard.classList.add('status-warn');
            verdictTitle.innerText = 'Inconclusive';
            verdictTitle.style.color = 'var(--warning)';
            verdictDesc.innerText = 'Suspicious artifacts found, but unable to definitively classify as completely synthetic.';
        } else {
            resultCard.classList.add('status-real');
            verdictTitle.innerText = 'Authentic Video';
            verdictTitle.style.color = 'var(--success)';
            verdictDesc.innerText = 'No significant manipulation or AI generation artifacts detected across analyzed frames.';
        }

        // Apply ring animation
        setTimeout(() => {
            ringProgress.style.strokeDashoffset = offset;
        }, 100);

        // Set metadata from API
        framesValue.innerText = data.frames_analyzed;
        timeValue.innerText = data.processing_time;
    }
});
