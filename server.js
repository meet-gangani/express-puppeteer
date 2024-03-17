const express = require('express');
const puppeteer = require('puppeteer');
const morganBody = require('morgan-body');

const app = express();
const port = 8080;

// app.use(bodyParser.json());
morganBody(app);

// Test API
app.get('/test', (req, res) => {
    res.status(200).send('Server is working!');
});

// Scrap API
app.get('/scrap', async (req, res) => {
    const startTime = new Date();
    try {
        const browser = await puppeteer.launch();

        const page = await browser.newPage();
        await page.goto('https://example.com');

        const text = await page.evaluate(() => {
            const h1 = document.querySelector('h1');
            return h1 ? h1.innerText : 'H1 tag not found';
        });

        await browser.close();

        const endTime = new Date();

        res.status(200).json({
            text
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Error fetching data');
    }
});


app.get('*', (req, res) => {
    res.status(200).send('Path not found!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
