//make a model for songs in the database
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	lyrics: {
		type: [String],
		required: true
	},
	chords: {
		type: [String],
		required: true
	}
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;

