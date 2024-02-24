Node Web Scraper <br />
This is a back-end program that scrapes the first post of every thread of the source website and stores them in MongoDB. 
The program will scrape any number of pages according to the user's input. It will not store duplicate posts.
Source: https://forums.redflagdeals.com/hot-deals-f9/

How It's Made
Tech used: Node, Express, Puppeteer, MongoDB

The program first prompts the user to enter a number of pages to scrape. It then launches a browser and starts fetching hrefs for posts on the first page and continuing for as many pages as the user requests. 
All links are pushed to an array. The program then loops through the array of hrefs, scrapes specific data from the first post of every thread, and adds that data to an array of objects. 
The program will then check for duplicate entries by searching for the same title in MongoDB. If there is no entry, it will save the post to the db. This will repeat for all hrefs. 
The program will then log any new entries added to the db in the console. If there is an error, it will be logged to the console. Finally, the program will close the browser.

Lessons Learned
This was a fun challenge! I had never tried web scraping before so I had to learn what it was and how to do it. It was similar to working with any API, fetching data and manipulating it. Then it was a simple matter of 
storing the data in the database, while checking for duplicates. 

How to Run
Run npm install
Connect to MongoDB and add connection string to .env as well as port
NPM run dev
Navigate to `http://localhost:${PORT}/api/scrape` in the browser
Follow the prompts in the console
