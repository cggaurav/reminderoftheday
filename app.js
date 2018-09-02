const Twitter = require('twitter')
const fs = require('fs')
const got = require('got')

const twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_TOKEN_SECRET
})

const SHEET_ID = process.env.SHEET_ID
const SHEET_URL = `https://spreadsheets.google.com/feeds/list/${SHEET_ID}/od6/public/values?alt=json`

// HOW: https://coderwall.com/p/duapqq/use-a-google-spreadsheet-as-your-json-backend

got(SHEET_URL, { json: true })
.then(response => {
	try {
		let reminders = response.body.feed.entry
		let reminder = reminders[Math.floor(Math.random() * reminders.length) + 1]

		console.log(`Tweeting .. "${reminder['gsx$quote']['$t']} ${reminder['gsx$who']['$t']}"`)

		twitter.post('statuses/update', { status: [reminder['gsx$quote']['$t'].trim(), reminder['gsx$who']['$t'].trim(), '#day', "#reminder"].join(' ') } )
		  	.catch((err) => {
		    	throw err
		  	})
	} catch (err) {
		throw err
	}
})
.catch(err => {
	throw err
})