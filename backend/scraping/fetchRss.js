require('dotenv').config();
const { Pool } = require('pg');
const Parser = require('rss-parser');
const parser = new Parser();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
});

const feeds = [
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss' }
];

async function insertArticle(article) {
  const query = `
    INSERT INTO rss_articles (source, title, link, summary, pub_dt, image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (link) DO NOTHING
  `;

  const values = [
    article.source,
    article.title,
    article.link,
    article.summary || null,
    article.pub_dt || null,
    article.img_url || null
  ];

  try {
    await pool.query(query, values);
  } catch (err) {
    console.error('Error inserting RSS article:', err);
  }
}

async function fetchAllFeeds() {
  let totalCount = 0;

  for (const feedInfo of feeds) {
    try {
      const rss = await parser.parseURL(feedInfo.url);
      console.log(`Fetched ${rss.items.length} articles from ${feedInfo.name}`);

      for (const item of rss.items) {
        await insertArticle({
          source: feedInfo.name,
          title: item.title,
          link: item.link,
          summary: item.contentSnippet || item.content || null,
          pub_dt: item.pubDate ? new Date(item.pubDate) : null,
          img_url: item.enclosure?.url || null
        });
        totalCount++;
      }
    } catch (err) {
      console.error(`Error fetching ${feedInfo.name}:`, err.message);
    }
  }

  console.log(`Total articles inserted: ${totalCount}`);
}

fetchAllFeeds().then(() => pool.end());