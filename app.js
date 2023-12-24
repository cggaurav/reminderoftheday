const express = require('express')
const http = require('http')
const fs = require('fs')
const got = require('got')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const { TwitterApi } = require('twitter-api-v2')
const SHEET_ID = process.env.SHEET_ID
const SHEET_URL = `https://opensheet.vercel.app/${SHEET_ID}/1`

const client = new TwitterApi({
	appKey: process.env.TWITTER_CONSUMER_KEY,
	appSecret: process.env.TWITTER_CONSUMER_SECRET,
	accessToken: process.env.TWITTER_TOKEN_KEY,
	accessSecret: process.env.TWITTER_TOKEN_SECRET
});

const rwClient = client.readWrite;

let app = express();
app.set('port', process.env.PORT || 3000)


app.get('/api', (req, res) => {
	got(SHEET_URL, { json: true })
		.then(response => {
			let reminders = response.body
			// console.log(`We have ${reminders.length} reminders`)
			let reminder = reminders[Math.floor(Math.random() * reminders.length) + 1]

			console.log(`Tweeting .. "${reminder['QUOTE']} ${reminder['WHO']}"`)

			rwClient.v2.tweet([reminder['QUOTE'].trim(), reminder['WHO'].trim(), '#day', "#reminder"].join(' '))
				.then(response => {
					console.log('Tweeted:', response.data);
					res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
				})
				.catch(error => {
					console.error('Error:', error);
					res.end(`Err ${e}`);
				});

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