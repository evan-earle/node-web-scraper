import puppeteer from "puppeteer";
import psp from "prompt-sync-plus";
import Post from "../models/Post.js";

export const scrape = async (req, res) => {
  let count = 0;
  // Prompt to scrape number of pages up to 51
  const prompt = psp({ defaultResponse: 1 });
  const number = prompt("Enter number of pages to scrape: ");

  // Launch a browser
  const browser = await puppeteer.launch();
  try {
    console.log(`Processing ${number} page(s)...`);
    // Initialize a page
    const page = await browser.newPage();

    // Set timeout to unlimited
    page.setDefaultNavigationTimeout(0);

    // Navigate to a page
    const allLinks = [];

    // Loop through number of pages according to user input
    for (let i = 1; i <= number; i++) {
      await page.goto(`https://forums.redflagdeals.com/hot-deals-f9/${i}`, {
        waitUntil: "domcontentloaded",
      });

      // Get the hrefs of all threads on the page
      const links = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll(
            "#site_content .thread_info_title h3 a:last-child"
          ),
          (e) => e.href
        )
      );
      // Push the hrefs to an array (spread puts it in one array)
      allLinks.push(...links);
    }

    // Loop through links array
    for (let i = 0; i < allLinks.length; i++) {
      // Go to each link in the array
      await page.goto(`${allLinks[i]}`);
      // Get data from first post of each thread
      const data = await page.evaluate(() =>
        // Pulling specific data from elements (date, username, title of post, deal link, retailer, content, attachments) and add to an array of objects
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
          // Ternary to check if attachments exist
          attachments: e.querySelector(".thread_original_post .attachbox")
            ? e.querySelector(".thread_original_post .attachbox a").href
            : "No attachments",
        }))
      );
      console.log(data);
      // Check for duplicates in db
      const post = await Post.findOne({ title: data[0].title });
      // If post doesn't exist, save to the db
      if (!post) {
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
        // Count the new post
        count += 1;
      }
    }
    // Log how many new entries were added to the db
    return count > 0
      ? console.log(`Processing complete. Added ${count} new entries!`)
      : console.log("Processing complete. No new entries.");
  } catch (err) {
    // Catch error and log/send it
    console.log(err);
    return res.send("Error");
  } finally {
    // Close the browser
    await browser.close();
    return;
  }
};
