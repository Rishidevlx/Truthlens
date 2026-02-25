const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:5001/analyze';

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const upload = multer({
    dest: path.join(__dirname, 'uploads/'), // Temporary storage
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'TruthLens Backend API is running' });
});

// Handle video upload
app.post('/api/analyze', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const stats = fs.statSync(req.file.path);
        const fileSizeInMB = stats.size / (1024 * 1024);
        console.log(`[${new Date().toISOString()}] Received video: ${req.file.originalname} (${fileSizeInMB.toFixed(2)} MB)`);

        // Use Buffer instead of Stream to avoid "stream aborted" errors during spin-ups
        const fileBuffer = fs.readFileSync(req.file.path);

        // --- ROBUST RETRY LOGIC FOR RENDER FREE TIER SPIN-UP ---
        let response;
        let attempts = 0;
        const maxAttempts = 5; // Increased to 5 attempts

        while (attempts < maxAttempts) {
            try {
                attempts++;
                console.log(`[${new Date().toISOString()}] Forwarding to AI Service (Attempt ${attempts}/${maxAttempts})...`);

                const form = new FormData();
                form.append('video', fileBuffer, req.file.originalname);

                response = await axios.post(PYTHON_API_URL, form, {
                    headers: { ...form.getHeaders() },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                    timeout: 240000 // 4 minutes per attempt
                });

                break; // Success!
            } catch (apiError) {
                console.error(`[${new Date().toISOString()}] Attempt ${attempts} failed: ${apiError.message}`);

                if (attempts < maxAttempts) {
                    // Optimized wait time for Render: 15s, 20s, 25s, 30s... total wait ~90s
                    const waitTime = (attempts + 2) * 5000;
                    console.log(`Waiting ${waitTime / 1000}s before retry for Python service to wake up...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else {
                    throw apiError; // All attempts failed
                }
            }
        }

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
        console.log(`[${new Date().toISOString()}] Analysis Success from Python service.`);
        res.json(response.data);

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Final Analysis Failure:`, error.message);

        if (req.file && req.file.path) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }

        res.status(502).json({
            error: 'AI Service Communication Failed',
            details: error.message,
            reason: 'Python service may be spinning up. Please try again in 1 minute.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`TruthLens Express Backend is running on port ${PORT}`);
});
