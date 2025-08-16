const fs = require('fs');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../db')
const nodemailer = require('nodemailer');

// email transporter
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

        // build HTML for articles
        const articlesHtml = articles.map(a => `
            <p>
                <strong><a href="${a.link}">${a.title}</a></strong><br>
                ${a.summary || ""}
            </p>    
        `).join('\n');
        
        // load email template
        const templatePath = path.join(__dirname, 'newsletter.html');
        let template = fs.readFileSync(templatePath, 'utf8');

        // replace placeholders in the email template
        template = template
            .replace('{{ date }}', new Date().toLocaleDateString())
            .replace('{{ articles }}', articlesHtml);

        // send email 
        await transporter.sendMail({
            from: `"The Daily Muzz" <${process.env.SMTP_USER}>`,
            to: process.env.NEWSLETTER_TO,
            subject: `The Daily Muzz Digest - ${new Date().toLocaleDateString()}`,
            html: template
        });

        console.log("Newsletter email sent successfully!");
    } catch (err) {
        console.error('Error sending newsletter: ', err);
    } finally {
        pool.end();
    }
}

module.exports = { sendNewsletter }; 
// run directly
// sendNewsletter();