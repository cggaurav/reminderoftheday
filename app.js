const Twitter = require('twitter')
const fs = require('fs')
const got = require('got')

const twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_TOKEN_SECRET
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const SHEET_ID = process.env.SHEET_ID
const SHEET_URL = `https://opensheet.vercel.app/${SHEET_ID}/1`

got(SHEET_URL, { json: true })
.then(response => {
	let reminders = response.body
	// console.log(`We have ${reminders.length} reminders`)
	let reminder = reminders[Math.floor(Math.random() * reminders.length) + 1]

	console.log(`Tweeting .. "${reminder['QUOTE']} ${reminder['WHO']}"`)

	twitter.post('statuses/update', { status: [reminder['QUOTE'].trim(), reminder['WHO'].trim(), '#day', "#reminder"].join(' ') } )
})
.catch((err) => {
	console.err(err)
	throw err
})