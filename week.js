const puppeteer = require("puppeteer");
require("dotenv").config();

const getWeek = async (req, res) => {
	const key = req.headers['x-api-key'];

	if (key !== process.env.API_KEY) {
		res.status(403).send('Forbidden');
		return;
	}

	const browser = await puppeteer.launch({
		args: [
			"--disable-setuid-sandbox",
			"--no-sandbox",
			"--single-process",
			"--no-zygote",
		],
		executablePath:
			process.env.NODE_ENV === "production"
				? process.env.PUPPETEER_EXECUTABLE_PATH
				: puppeteer.executablePath(),
	});
	try {
		const url = 'https://gol.gg/players/list/season-S14/split-ALL/tournament-CBLOL%20Split%201%202024/';

		const page = await browser.newPage();
		await page.goto(url, { timeout: 0 });

		const value = await page.evaluate(() => {
			const select = document.querySelector('#comboweek');
			return select.options[1]?.value || '';
		});

		res.status(200).json(value);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		await browser.close();
	}
};

module.exports = { getWeek };
