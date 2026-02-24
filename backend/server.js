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

        console.log(`[${new Date().toISOString()}] Received video file for analysis: ${req.file.originalname}`);

        // --- REAL IMPLEMENTATION (Calls Python service) ---
        const form = new FormData();
        form.append('video', fs.createReadStream(req.file.path), req.file.originalname);

        try {
            console.log(`[${new Date().toISOString()}] Forwarding video to Python AI Service...`);
            const response = await axios.post(PYTHON_API_URL, form, {
                headers: {
                    ...form.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 120000 // 2 minutes timeout for heavy AI processing
            });

            // Clean up the uploaded file after sending to Python service
            fs.unlinkSync(req.file.path);
            res.json(response.data);
            console.log(`[${new Date().toISOString()}] Successfully received analysis from Python service.`);

        } catch (apiError) {
            console.error('Error communicating with Python API:', apiError.message);
            // Clean up the file
            fs.unlinkSync(req.file.path);
            return res.status(502).json({ error: 'Failed to communicate with AI Service' });
        }

    } catch (error) {
        console.error('Error analyzing video:', error);

        // Cleanup file if an error occurs
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Failed to cleanup file:', cleanupError);
            }
        }

        res.status(500).json({ error: 'Internal server error during analysis' });
    }
});

app.listen(PORT, () => {
    console.log(`TruthLens Express Backend is running on port ${PORT}`);
});
