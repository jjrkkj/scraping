const puppeteer = require("puppeteer");
require("dotenv").config();

const getPlayers = async (res) => {
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

		const { value } = await page.evaluate(() => {
			const select = document.querySelector('#comboweek');
			return { value: select.options[1]?.value || '' };
		});

		await page.select('#comboweek', value);

		await new Promise(resolve => setTimeout(resolve, 3000));

		const data = await page.evaluate((value) => {
			const rows = document.querySelectorAll('.playerslist tbody tr');

			return Array.from(rows, row => {
				const columns = row.querySelectorAll('td');

				const name = columns[0]?.innerText;
				const kda = Number(columns[4]?.innerText);
				const csm = Number(columns[8]?.innerText);
				const soloKills = columns[23]?.innerText === '-' ? 0 : Number(columns[23]?.innerText);
				const dpm = Number(columns[12]?.innerText);
				const vspm = Number(columns[13]?.innerText);
				const kp = Number(columns[10]?.innerText.replace('%', '')) / 100;
				const gd15 = Number(columns[17]?.innerText);
				const gpm = Number(columns[9]?.innerText);

				return {
					name: name,
					kda: kda,
					csm: csm,
					solo_kills: soloKills,
					dpm: dpm,
					vspm: vspm,
					kp: kp,
					gd15: gd15,
					gpm: gpm,
					week: Number(value.replace('WEEK', '')),
				}
			});
		}, value);

		await browser.close();

		res.status(200).json(data);
	} catch (e) {
		console.error(e);
		res.send(`Something went wrong while running Puppeteer: ${e}`);
	} finally {
		await browser.close();
	}
};

module.exports = { getPlayers };
