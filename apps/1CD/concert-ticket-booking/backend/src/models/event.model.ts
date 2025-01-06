import { model, models, Schema } from 'mongoose';

type Event = {
  _id: Schema.Types.ObjectId;
  name: string;
  scheduledDays: string[];
  description: string;
  mainArtists: object[];
  guestArtists: object[];
  products: Schema.Types.ObjectId[];
  image: string;
  discount: number;
  isArchived: boolean;
  venue: Schema.Types.ObjectId;
  priority: string;
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
    scheduledDays: [
      {
        type: String,
        required: true,
      },
    ],
    mainArtists: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    guestArtists: [
      {
        name: {
          type: String,
        },
      },
    ],
    image: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: false,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Ticket',
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
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'low',
    },
  },
  {
    timestamps: true,
  }
);
const Event = models['Event'] || model('Event', eventSchema);
export default Event;
