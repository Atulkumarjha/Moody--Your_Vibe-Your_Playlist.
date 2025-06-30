import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  spotifyId: String,
  userId: String,
  name: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export const playlist = 
mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);