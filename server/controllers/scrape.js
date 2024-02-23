import puppeteer from "puppeteer";
import Post from "../models/Post.js";

// Scrapes the first page
export const scrape = async (req, res) => {
  let count = 0;
  // Launch a browser
  const browser = await puppeteer.launch();
  try {
    console.log("Processing...");
    // Initialize a page
    const page = await browser.newPage();

    // Set timeout to unlimited
    page.setDefaultNavigationTimeout(0);

    // Navigate to a page
    await page.goto(`https://forums.redflagdeals.com/hot-deals-f9/`);

    // Get the hrefs of all threads on the first page
    const links = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#site_content .thread_info_title h3 a:last-child"
        ),
        (e) => e.href
      )
    );

    // Loop through links array
    for (let i = 0; i < links.length; i++) {
      await page.goto(`${links[i]}`);
      // Get data from first post of each thread
      const data = await page.evaluate(() =>
        // Pulling specific data from elements (date, username, title of post, deal link, retailer, content, attachments)
        Array.from(document.querySelectorAll(".thread_original_post"), (e) => ({
          date: e
            .querySelector(".post_dateline")
            .textContent.replace(/\s+/g, " ")
            .split("#")[0]
            .trim(),
          username: e.querySelector(".thread_original_post .postauthor")
            .textContent,
          title: e.querySelector(".thread_original_post h2").textContent.trim(),
          // Ternary to check if dealLink/retailer exist
          dealLink: e.querySelector(".thread_original_post .post_offer a")
            ? e.querySelector(".thread_original_post .post_offer a").href
            : "No deal link",
          retailer: e.querySelector(
            ".thread_original_post .post_offer dd:last-child"
          )
            ? e
                .querySelector(
                  ".thread_original_post .post_offer dd:last-child"
                )
                .textContent.replace(/\s+/g, " ")
            : "No retailer",
          content: e
            .querySelector(".thread_original_post .content")
            .textContent.replace(/\s+/g, " "),
          // If there are attachments add href otherwise null
          attachments: e.querySelector(".thread_original_post .attachbox")
            ? e.querySelector(".thread_original_post .attachbox a").href
            : "No attachments",
        }))
      );

      // Check for duplicates in db
      const post = await Post.findOne({ title: data[0].title });

      if (post) {
        continue;
      } else {
        // Save data to a new post in the model
        const newPost = new Post({
          date: data[0].date,
          username: data[0].username,
          title: data[0].title,
          dealLink: data[0].dealLink,
          retailer: data[0].retailer,
          content: data[0].content,
          attachments: data[0].attachments,
        });
        await newPost.save();
        count += 1;
      }
    }
    count > 0
      ? console.log(`Processing complete. Added ${count} new entries!`)
      : console.log("Processing complete. No new entries.");
  } catch (err) {
    // Catch error and log/send it
    console.log(err);
    res.send("Error");
  } finally {
    // Close the browser
    await browser.close();
  }
};
