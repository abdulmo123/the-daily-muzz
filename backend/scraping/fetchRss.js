const Parser = require('rss-parser');
const parser = new Parser();

const sources = [
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml'},
    // { name: 'TRT World', url: 'https://www.trtworld.com/rss.xml'},
    { name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss.xml'}
]

async function fetchArticles() {
    const allArticles = [];

    for (const source of sources) {
        try {
            const feed = await parser.parseURL(source.url);
            console.log(`Fetched ${feed.items.length} articles from ${source.name}`);
            
            const articles = feed.items.map(item => ({
                source: source.name,
                title: item.title,
                link: item.link,
                pubDate: item.pubDate
            }));

            allArticles.push(...articles);
        } catch (err) {
            console.error(`Error fetching ${source.name}:`, err.message);
        }
    }
    return allArticles;
}

if (require.main === module) {
    fetchArticles().then(articles => {
        console.log(`Total articles fetched: ${articles.length}`)
    });
}

module.exports = { fetchArticles };