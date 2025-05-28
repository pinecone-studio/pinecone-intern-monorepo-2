import { model, models, Schema } from 'mongoose';

const artistScheme = new Schema({
  name: { type: String, required: true },
  avatarImage: { type: String, required: true },
});
export const ArtistModel = models.Artist || model('Artist', artistScheme);
