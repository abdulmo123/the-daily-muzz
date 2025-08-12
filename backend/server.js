const express = require('express');
const { fetchArticles } = require('./scraping/fetchRss');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/articles', async (req, res) => {
    try {
        const articles = await fetchArticles();
        res.json(articles);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});