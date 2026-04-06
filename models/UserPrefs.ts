import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserPrefs extends Document {
  githubId: string;
  username: string;
  avatar: string;
  skills: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  languages: string[];
  updatedAt: Date;
}

const UserPrefsSchema: Schema = new Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  skills: { type: [String], default: [] },
  experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  languages: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

const UserPrefs: Model<IUserPrefs> = mongoose.models.UserPrefs || mongoose.model<IUserPrefs>('UserPrefs', UserPrefsSchema);

export default UserPrefs;
