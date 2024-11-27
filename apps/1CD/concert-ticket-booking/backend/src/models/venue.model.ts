import { model, models, Schema } from 'mongoose';

type Venue = {
  _id: Schema.Types.ObjectId;
  name: string;
  image: string;
  capacity: string;
  size: number;
};

const venueSchema = new Schema<Venue>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Venue = models['Venue'] || model('Venue', venueSchema);
export default Venue;
