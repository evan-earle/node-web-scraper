import puppeteer from "puppeteer";

export const scrape = async (res) => {
  // Launch a browser
  const browser = await puppeteer.launch();
  try {
    // Initialize a page
    const page = await browser.newPage();

    // Navigate to a page
    await page.goto("https://forums.redflagdeals.com/hot-deals-f9/");

    // Get the hrefs of all threads on the first page
    const links = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#site_content .thread_info_title h3 a:last-child"
        ),
        (e) => e.href
      )
    );

    res.send(links);
    console.log(links.length);
  } catch (err) {
    console.log(err);
    res.send("Error");
  } finally {
    // Close the browser
    await browser.close();
  }
};
