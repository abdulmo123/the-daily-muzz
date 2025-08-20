const { fetchAllFeeds } = require('./scraping/fetchRss');
const { sendNewsletter } = require('./email/sendNewsletter');

(async () => {
  try {
    await fetchAllFeeds();
    await sendNewsletter();
    console.log("All done!");
    process.exit(0); // ensure the process exits
  } catch (err) {
    console.error("Error running daily job:", err);
    process.exit(1);
  }
})();