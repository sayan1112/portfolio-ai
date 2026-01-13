const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple "Database" Paths
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');
const NEWS_FILE = path.join(__dirname, 'data', 'news.json');
const SUBS_FILE = path.join(__dirname, 'data', 'subscribers.json');

// Admin Auth (In a real app, use environment variables and hashing!)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize "Database" files if they don't exist
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
if (!fs.existsSync(SUBS_FILE)) fs.writeFileSync(SUBS_FILE, JSON.stringify([]));
if (!fs.existsSync(NEWS_FILE)) {
    const initialNews = [
        { id: 1, date: 'Jan 12, 2024', title: 'New Portfolio Launch', excerpt: 'Successfully launched the new premium portfolio design with integrated backend.', category: 'Update' },
        { id: 2, date: 'Jan 05, 2024', title: 'Award Nomination', excerpt: 'My latest SaaS project was nominated for an interface design award.', category: 'Achievement' },
        { id: 3, date: 'Dec 20, 2023', title: 'React Performance Guide', excerpt: 'Published a short guide on optimizing React apps for better Lighthouse scores.', category: 'Article' }
    ];
    fs.writeFileSync(NEWS_FILE, JSON.stringify(initialNews, null, 2));
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API: Get Latest News
app.get('/api/news', (req, res) => {
    try {
        const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
        res.json(news);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch news' });
    }
});

// API: Contact Form with Persistence
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    const timestamp = new Date().toISOString();

    const newMessage = { id: Date.now(), name, email, message, timestamp };

    try {
        // Read existing messages
        const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
        data.push(newMessage);
        
        // Save back to file
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));

        console.log('--- New Message Saved ---');
        console.log(`From: ${name} (${email})`);
        console.log(`Message: ${message}`);
        console.log('--------------------------');

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been saved to the database!' 
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, message: 'Could not save message.' });
    }
});

// API: Newsletter Subscription
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    try {
        const subs = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
        if (subs.includes(email)) {
            return res.status(400).json({ success: false, message: 'Already subscribed!' });
        }
        subs.push(email);
        fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));
        res.json({ success: true, message: 'Subscribed successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to subscribe' });
    }
});

// API: Admin Dashboard Data (Protected with simple basic auth)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
        const subscribers = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8'));
        const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
        res.json({ success: true, data: { messages, subscribers, news } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// API: Add News (Admin only)
app.post('/api/news/add', (req, res) => {
    // In a real app, verify token/session here
    const { title, excerpt, category, date } = req.body;
    try {
        const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
        const newItem = { id: Date.now(), title, excerpt, category, date };
        news.unshift(newItem); // Add to beginning
        fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2));
        res.json({ success: true, message: 'News added!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add news' });
    }
});

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve the main index.html for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open your browser to see your portfolio live with backend support!`);
});
