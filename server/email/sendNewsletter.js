const fs = require('fs');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../db')
const nodemailer = require('nodemailer');
const db = require('../db');

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
        let articles;
        // fetch articles over last day
        if (process.env.DB_CLIENT === 'pg') {
            const { rows } = await pool.query(`
                SELECT art.title, art.link, art.summary, src.logo_url
                FROM tdm.rss_articles art
                JOIN tdm.sources src on art.source = src.source
                WHERE pub_dt >= NOW() - INTERVAL '1 day'
                and sent = false
                ORDER BY pub_dt DESC
            `); 
            articles = rows;
        } else if (process.env.DB_CLIENT === 'supabase') {
            const { data, error } = await db
                .from('rss_articles')
                .select('title,link,summary,source,sources!inner(logo_url)')
                .gte('pub_dt', new Date(Date.now() - 24 * 60 * 1000).toISOString())
                .eq('sent', false)
                .order('pub_dt', { ascending: false });

                if (error) throw error;
                articles = data.map(a => ({
                    title: a.title,
                    link: a.link,
                    summary: a.summary,
                    source: a.source,
                    logo_url: a.sources.logo_url
                }));
        }

        if (!articles.length || articles.length === 0) {
            console.log('No new articles to send today.');
            return;
        }

        // build HTML for articles
        const articlesHtml = articles.map(a => `
            <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                ${a.logo_url ? `<img src="${a.logo_url}" alt="${a.source}" style="width:50px; height:auto; margin-right:10px;">` : ''}
                <div>
                    <strong><a href="${a.link}" style="text-decoration:none; color:#000;">${a.title}</a></strong><br>
                    ${a.summary || ""}
                </div>
            </div>
        `).join('\n');
        
        // load email template
        const templatePath = path.join(__dirname, 'newsletter.html');
        let template = fs.readFileSync(templatePath, 'utf8');

        // replace placeholders in the email template
        template = template
            .replace('{{ date }}', new Date().toLocaleDateString())
            .replace('{{ articles }}', articlesHtml);

        // fetch subscribers list
        let subscribers;
        if (process.env.DB_CLIENT === 'pg') {
            const { rows } = await pool.query('SELECT email from tdm.subscribers');
            subscribers = rows;
        } else if (process.env.DB_CLIENT === 'supabase') {
            const { data, error } = await db
                .from('subscribers')
                .select('email');
            if (error) throw error;
            subscribers = data;
        }
        const recipientList = subscribers.map(e => e.email).join(', ');

        // send email 
        await transporter.sendMail({
            from: `"The Daily Muzz" <${process.env.SMTP_USER}>`,
            to: recipientList,
            subject: `The Daily Muzz Digest - ${new Date().toLocaleDateString()}`,
            html: template
        });

        const links = articles.map(a => a.link);
        if (process.env.DB_CLIENT === 'pg') {
            const links = articles.map(a => a.link);
            await db.query('UPDATE rss_articles SET sent = true WHERE link = ANY($1)', [links]);
        } else if (process.env.DB_CLIENT === 'supabase') {
            const links = articles.map(a => a.link);
            const { error } = await db
                .from('rss_articles')
                .update({ sent: true })
                .in('link', links);
            if (error) throw error;
        }

        console.log("Newsletter email sent successfully!");
        console.log('Set sent articles to true!');
    } catch (err) {
        console.error('Error sending newsletter: ', err);
    } finally {
        // do nothing
    }
}

module.exports = { sendNewsletter }; 
// run directly
// sendNewsletter();