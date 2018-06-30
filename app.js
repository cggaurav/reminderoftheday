const Twitter = require('twitter')
const csv = require('csv-parser')
const fs = require('fs')

const REMINDERS_FILE = 'data/reminders.csv'

const twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_TOKEN_SECRET
})

let reminders = []
 
fs.createReadStream(REMINDERS_FILE)
	.pipe(csv())
	.on('data', (data) => {
		console.log(data)
    	reminders.push(data)
	})
	.on('error', (err) => {
		throw err
	})
	.on('end', () => {
		let reminder = reminders[Math.floor(Math.random() * reminders.length) + 1]

		console.log('Tweeting...')

		twitter.post('statuses/update', { status: [reminder.quote.trim(), reminder.who.trim()].join(' ') } )
		  	.catch((err) => {
		    	throw err
		  	})
	})