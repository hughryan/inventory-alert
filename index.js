import 'dotenv/config';
import {
	interval,
	slack,
	discord,
	puppet,
} from './utilities/index.js';

console.log('Initializing...');
const urlWatchlist = JSON.parse(process.env.URL_WATCHLIST);
const soldOutCopy = JSON.parse(process.env.SOLD_OUT_COPY);

const isSoldOut = (html) => {
	if (!html) return true;
	const lowerHtml = html.toLowerCase();
	for (let copy of soldOutCopy) {
		if (lowerHtml.includes(copy)) {
			return true;
		}
	}
	return false;
}

interval(
	parseInt(process.env.INTERVAL_MS),
	async () => {
		console.log('Scraping pages...')
		for (let uri of urlWatchlist) {
			try {
				const html = await puppet(uri);

				if (!isSoldOut(html)) {
					console.log(`Item potentially in stock at: ${uri}`);
					if (slack.enabled) {
						slack.webhook.send(`Item potentially in stock at: ${uri}`);
						console.log('*** Posted to slack ***');
					}
					if (discord.enabled) {
						await discord.webhook.send(`Item potentially in stock at: ${uri}`);
						console.log('*** Posted to discord ***');
					}
				} else {
					console.log(`Item sold out at: ${uri}`);
				}
			} catch (err) {
				console.log(`${err.message} for: ${uri}`);
			}
		}
	}
);
