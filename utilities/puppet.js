import puppeteer from 'puppeteer';
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fetch from 'cross-fetch';
import { promises as fs } from 'fs';
import which from 'which';

const chromiumPath = which.sync('chromium', {nothrow: true})
const options = {
	args: [
		'--disable-dev-shm-usage',
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
	],
};
if (chromiumPath) options.executablePath = chromiumPath;
const browser = await puppeteer.launch(options);
const pages = await browser.pages();
const page = pages[0];
if (process.env.ADBLOCK_ENABLED.toLowerCase() == 'true') {
	PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch, {
		path: 'engine.bin',
		read: fs.readFile,
		write: fs.writeFile,
	}).then((blocker) => {
		blocker.enableBlockingInPage(page);
	}).catch(err => {
		console.log('ERROR: Failed to load adblock', err);
	});
}
await page.setUserAgent(process.env.USER_AGENT);
await page.setViewport({
	width: parseInt(process.env.BROWSER_WIDTH),
	height: parseInt(process.env.BROWSER_HEIGHT),
});

const onClose = () => {
	browser.close();
	process.exit(1);
}
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri) => {
	await page.goto(uri, {
		timeout: parseInt(process.env.LOAD_TIMEOUT),
		waitUntil: 'load',
	});
	await page.waitForTimeout(parseInt(process.env.WAIT_AFTER_LOAD_MS));

	return page.content();
};
