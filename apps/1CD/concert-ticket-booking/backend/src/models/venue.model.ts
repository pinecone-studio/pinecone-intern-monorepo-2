import { model, models, Schema } from 'mongoose';

type Venue = {
  _id: Schema.Types.ObjectId;
  name: string;
  image: string;
  location:string;
  capacity: string;
  size: string;
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
    location: {
      type:String,
      required:true,
    },
    capacity: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Venue = models['Venue'] || model('Venue', venueSchema);
export default Venue;
