const mongoose = require('mongoose');

const ScoresSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    name: {
      type: String,
      required: true
    },
    score: {
        type: Number,
        required: true
    }
});

const Scores = mongoose.model('Scores', ScoresSchema);

module.exports = {Scores};