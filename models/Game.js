const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, min: 1, max: 10, required: true },
  text:    { type: String, maxlength: 1000 }
}, { timestamps: true });

const gameSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre:       { type: String, required: true, enum: ['Akční', 'RPG', 'Strategie', 'Sportovní', 'Horor', 'Simulátor', 'Plošinová', 'Puzzle', 'Jiné'] },
  developer:   { type: String, required: true },
  releaseYear: { type: Number, required: true },
  platform:    [{ type: String, enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobilní'] }],
  coverImage:  { type: String, default: 'default-cover.png' },
  reviews:     [reviewSchema],
  addedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Virtuální průměrné hodnocení
gameSchema.virtual('avgRating').get(function () {
  if (!this.reviews.length) return null;
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Game', gameSchema);
