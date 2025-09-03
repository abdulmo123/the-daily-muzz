const express = require('express');
const cors = require('cors');
const { fetchArticles } = require('./scraping/fetchRss');
const { addSubscriber, removeSubscriber } = require('./email/subscriber');

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

        res.status(201).json({
            message: 'Subscriber added successfully!'
        });
    } catch (error) {
        console.error('Error adding subscriber:', error);
        res.status(500).json({
            message: 'Subscriber already exists'
        });
    }
});

app.delete('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Received data:', { email });

        const subscriber = await removeSubscriber({email});

        res.status(200).json({
            message: 'Subscriber removed successfully!'
        });
    } catch (error) {
        console.error('Error removing subscriber:', error);
        res.status(500).json({
            message: 'Error removing subscriber'
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});