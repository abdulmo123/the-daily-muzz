const fs = require('fs');
const path = require('path')
require('dotenv').config();
const pool = require('../db')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

async function sendNewsletter() {
    try {
        // fetch articles over last day
        const { rows: articles } = await pool.query(`
            SELECT title, link, summary
            FROM tdm.rss_articles
            WHERE pub_dt >= NOW() - INTERVAL '1 day'
            ORDER BY pub_dt DESC
        `); 

        if (!articles.length || articles.length === 0) {
            console.log('No new articles to send today.');
            return;
        }

        // built HTML for articles
        const articlesHtml = articles.map(a => `
            <p>
                <strong><a href="${a.link}">${a.title}</a></strong><br>
                ${a.summary || ""}
            </p>    
        `).join('\n');

    }
}