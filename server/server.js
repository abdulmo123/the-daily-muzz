const express = require('express');
const cors = require('cors');
const { fetchArticles } = require('./scraping/fetchRss');
const { addSubscriber } = require('./email/subscriber');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/articles', async (req, res) => {
    try {
        const articles = await fetchArticles();
        res.json(articles);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/subscribers', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Received data:', { email });

        const subscriber = await addSubscriber({email});

        if (!subscriber.success) {
            return res.status(409).json({ message: subscriber.message });
        }

        res.status(201).json({
            message: 'Subscriber added successfully!',
            email: subscriber.email.email
        });
    } catch (error) {
        console.error('Error adding subscriber:', error);
        res.status(500).json({
            message: 'Subscriber already exists'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});