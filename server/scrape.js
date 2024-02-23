import puppeteer from "puppeteer";

export const scrape = async (res) => {
  // Launch a browser
  const browser = await puppeteer.launch();
  try {
    // Initialize a page
    const page = await browser.newPage();

    // Navigate to a page
    await page.goto("https://forums.redflagdeals.com/hot-deals-f9/");

    // Testing
    const title = await page.evaluate(() => document.title);
    console.log(title);
    res.send(title);
  } catch (err) {
    console.log(err);
    res.send("Error");
  } finally {
    // Close the browser
    await browser.close();
  }
};
