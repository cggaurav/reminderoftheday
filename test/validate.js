const csv = require('csv-parser')
const fs = require('fs')

const REMINDERS_FILE = 'data/reminders.csv'
 
fs.createReadStream(REMINDERS_FILE)
	.pipe(csv())
	.on('data', (log) => {
		// 5 for the hash tag
		if (log.quote.trim().length + 5 + log.who.trim().length > 280) {
    		// This should exit as failure
    		throw new Error(`${JSON.stringify(log)} is too big to tweet`)
    	}
	})
	.on('error', (err) => {
		throw err
	})
	.on('end', () => {
		process.exit(0)
	})