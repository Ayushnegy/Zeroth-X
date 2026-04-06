import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookmark extends Document {
  githubId: string;
  issueId: number;
  title: string;
  url: string;
  repoName: string;
  repoOwner: string;
  labels: string[];
  language: string;
  stars: number;
  savedAt: Date;
}

const BookmarkSchema: Schema = new Schema({
  githubId: { type: String, required: true },
  issueId: { type: Number, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  repoName: { type: String, required: true },
  repoOwner: { type: String, required: true },
  labels: { type: [String], default: [] },
  language: { type: String },
  stars: { type: Number, default: 0 },
  savedAt: { type: Date, default: Date.now }
});

BookmarkSchema.index({ githubId: 1, issueId: 1 }, { unique: true });

const Bookmark: Model<IBookmark> = mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

export default Bookmark;
