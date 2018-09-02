const got = require('got')

const SHEET_ID = process.env.SHEET_ID
const SHEET_URL = `https://spreadsheets.google.com/feeds/list/${SHEET_ID}/od6/public/values?alt=json`

got(SHEET_URL, { json: true })
.then(response => {
	try {
		let reminders = response.body.feed.entry

		reminders.forEach((reminder) => {
			// All characters
			if (reminder['gsx$quote']['$t'].trim().length + 13 + reminder['gsx$who']['$t'].trim().length > 280) {
				throw new Error(`${JSON.stringify(reminder)} is too big to tweet`)
			}
		})

		console.log('Done.')

	} catch (err) {
		throw err
	}
})
.catch(err => {
	throw err
})
