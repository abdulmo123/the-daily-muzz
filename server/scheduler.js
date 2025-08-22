const cron = require('node-cron');
const { fetchAllFeeds } = require('./scraping/fetchRss');
const { sendNewsletter } = require('./email/sendNewsletter');

(async () => {
    console.log('Running initial RSS fetch on startup ...');
    try {
        await fetchAllFeeds();
        console.log('Initial RSS fetch completed!');

        await sendNewsletter();
        console.log('Newsletter sent successfully!');

        process.exit(0);
    } catch (err) {
        console.error('Error during initial RSS fetch: ', err);
        process.exit(1);
    }
})();