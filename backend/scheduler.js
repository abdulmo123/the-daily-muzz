import cron from 'node-cron';
import { fetchAllFeeds } from './scraping/fetchRss.js';

// run on startup
(async () => {
    console.log('Running initial RSS fetch on startup ...');
    try {
        await fetchAllFeeds();
        console.log('Initial RSS fetch completed!');
    } catch (err) {
        console.error('Error during initial RSS fetch: ', err);
    }
})();

// scheduled 7 AM cron job
cron.schedule('0 7 * * *', async () => {
    console.log('Running daily RSS fetch job at 7AM');
    try {
        await fetchAllFeeds();
        console.log("RSS fetch completed successfully!");
    }
    catch (err) {
        console.error("Error running RSS fetch: ", err);
    }
});

console.log("Scheduler started, waiting for scheduled jobs ...");