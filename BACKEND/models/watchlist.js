import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate stock entries per user
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist = mongoose.model('Watchlist', watchlistSchema);

