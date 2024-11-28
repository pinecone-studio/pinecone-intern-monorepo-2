import { model, models, Schema } from 'mongoose';

type Event = {
  _id: Schema.Types.ObjectId;
  name: string;
  description: string;
  mainArtists: string[];
  guestArtists: string[];
  dayTickets: Schema.Types.ObjectId[];
  images: [string];
  discount: number;
  venue: Schema.Types.ObjectId;
  priority: boolean;
  category: Schema.Types.ObjectId[];
};

const eventSchema = new Schema<Event>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: 'comment',
    },
    mainArtists: [
      {
        type: String,
        required: true,
      },
    ],
    guestArtists: [
      {
        type: String,
        default: '',
      },
    ],
    images: {
      type: [String],
      default: ['img'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    dayTickets: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Tickets',
      },
    ],
    category: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
      },
    ],
    venue: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Venue',
    },
  },
  {
    timestamps: true,
  }
);
const Event = models['Event'] || model('Event', eventSchema);
export default Event;
