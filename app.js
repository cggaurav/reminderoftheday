const express = require('express');
const http = require('http')
const Twitter = require('twitter')
const fs = require('fs')
const got = require('got');

let app = express();
app.set('port', process.env.PORT || 3000)

const SHEET_ID = process.env.SHEET_ID
const SHEET_URL = `https://opensheet.vercel.app/${SHEET_ID}/1`

const twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_TOKEN_SECRET
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.get('/api', (req, res) => {
	got(SHEET_URL, { json: true })
		.then(response => {
			let reminders = response.body
			// console.log(`We have ${reminders.length} reminders`)
			let reminder = reminders[Math.floor(Math.random() * reminders.length) + 1]

			console.log(`Tweeting .. "${reminder['QUOTE']} ${reminder['WHO']}"`)

			twitter.post('statuses/update', { status: [reminder['QUOTE'].trim(), reminder['WHO'].trim(), '#day', "#reminder"].join(' ') })
				.then((s) => {
					console.log(`Tweeting .. `, s)
					res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
				})
				.catch((e) => {
					console.log('We have an error', e)
					res.end(`Err ${e}`);
				})

		})
		.catch((err) => {
			console.log(err)
			// throw err
			res.end(`Err ${err}`);
		})
	
});

app.get('/', (req, res) => {
	res.end('Reminder of the day!')
});

http.createServer(app).listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'))
})