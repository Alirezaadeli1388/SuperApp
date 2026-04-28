const express = require('express');
const puppeteer = require('puppeteer-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/get-audio', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ error: "No URL" });

  let audioUrls = [];

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // 🔥 مهم: request نه response
    page.on('request', (request) => {
      const url = request.url();

      if (
        url.includes('.mp3') ||
        url.includes('.m3u8') ||
        url.includes('.m4a')
      ) {
        console.log("FOUND:", url);
        audioUrls.push(url);
      }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

// ⬇️ جایگزین waitForTimeout
await new Promise(r => setTimeout(r, 5000));

await page.evaluate(() => {
  const el = document.querySelector('video');
  if (el) el.play();
});

// ⬇️ دوباره جایگزین
await new Promise(r => setTimeout(r, 8000));

    await page.waitForTimeout(8000);

    await browser.close();

    res.json({ audio: [...new Set(audioUrls)] });

  } catch (e) {
    console.log(e);
    res.json({ error: "Failed", detail: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});