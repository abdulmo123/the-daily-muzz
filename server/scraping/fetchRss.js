const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../db');
const Parser = require('rss-parser');
const parser = new Parser();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432
// });

// const feeds = [
//   { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
//   { name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss' }
// ];

async function insertArticle(article) {
  if (process.env.DB_CLIENT === 'pg') {
    const query = `
      INSERT INTO tdm.rss_articles (source, title, link, summary, pub_dt, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (link) DO NOTHING
    `;

    const values = [
      article.source,
      article.title,
      article.link,
      article.summary || null,
      article.pub_dt || null,
      article.image_url || null
    ];

    try {
      await pool.query(query, values);
    } catch (err) {
      console.error('Error inserting RSS article:', err);
    }
  } else if (process.env.DB_CLIENT === 'supabase') {
    const { error } = await db
      .from('tdm.rss_articles')
      .upsert({
        source: article.source,
        title: article.title,
        link: article.link,
        summary: article.summary || null,
        pub_dt: article.pub_dt || null,
        image_url: article.image_url || null
      }, { onConflict: 'link' });
    
    if (error) {
      console.error('Error inserting RSS article:', error.message);
    }
  }
}

async function fetchAllFeeds() {
  let totalCount = 0;
  let sources = [];

  if (process.env.DB_CLIENT === 'pg') {
    const result = await pool.query('SELECT source, feed_url FROM tdm.sources');
    sources = result.rows;
  } else if (process.env.DB_CLIENT === 'supabase') {
    const { data, error } = await pool.from('tdm.sources').select('source, feed_url');
    if (error) {
      console.error("Error fetching sources from Supabase", error.message);
      return;
    }

    sources = data;
  }

  

  for (const feedInfo of sources) {
    try {
      const rss = await parser.parseURL(feedInfo.feed_url);
      console.log(`Fetched ${rss.items.length} articles from ${feedInfo.source}`);

      for (const item of rss.items) {
        await insertArticle({
          source: feedInfo.source,
          title: item.title,
          link: item.link,
          summary: item.contentSnippet || item.content || null,
          pub_dt: item.pubDate ? new Date(item.pubDate) : null,
          image_url: item.image_url
        });
        totalCount++;
      }
    } catch (err) {
      console.error(`Error fetching ${feedInfo.source}:`, err.message);
    }
  }

  console.log(`Total articles inserted: ${totalCount}`);
}

module.exports = { fetchAllFeeds }; 
// run directly for (testing)
// fetchAllFeeds().then(() => pool.end());