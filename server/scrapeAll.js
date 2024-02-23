import puppeteer from "puppeteer";

export const scrapeAll = async (res) => {
  // Launch a browser
  const browser = await puppeteer.launch();
  try {
    // Initialize a page
    const page = await browser.newPage();

    // Navigate to a page
    const allLinks = [];
    // Change 3 to 51 to scrape all 51 pages
    for (let i = 1; i <= 2; i++) {
      await page.goto(`https://forums.redflagdeals.com/hot-deals-f9/${i}`);

      // Get the hrefs of all threads on the first page
      const links = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "#site_content .thread_info_title h3 a:last-child"
          ),
          (e) => e.href
        )
      );
      allLinks.push(...links);
    }

    // Loop through links array
    for (let i = 0; i < allLinks.length; i++) {
      await page.goto(`${allLinks[i]}`);
      // Get data from first post of each thread
      const data = await page.evaluate(() =>
        // Pulling specific data from elements (date, username, title of post, content, attachments)
        Array.from(document.querySelectorAll(".thread_original_post"), (e) => ({
          date: e
            .querySelector(".post_dateline")
            .textContent.replace(/\s+/g, " ")
            .split("#")[0]
            .trim(),
          username: e.querySelector(".thread_original_post .postauthor")
            .textContent,
          title: e.querySelector(".thread_original_post h2").textContent,
          content: e
            .querySelector(".thread_original_post .content")
            .textContent.replace(/\s+/g, " "),
          // If there are attachments add href otherwise null
          attachments: e.querySelector(".thread_original_post .attachbox")
            ? e.querySelector(".thread_original_post .attachbox a").href
            : "No attachments",
        }))
      );
      console.log(data);
    }
    console.log("end of data");
  } catch (err) {
    // Catch error and log/send it
    console.log(err);
    res.send("Error");
  } finally {
    // Close the browser
    await browser.close();
  }
};
