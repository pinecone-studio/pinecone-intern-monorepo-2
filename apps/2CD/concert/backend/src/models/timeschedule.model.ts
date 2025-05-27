import { Schema, model, models, Types } from 'mongoose';
const scheduleModel = new Schema(
  {
    endDate: {
      type: Date,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    concert: { type: Types.ObjectId, ref: 'Concert', required: true },
    venue: { type: Types.ObjectId, ref: 'Venue', required: true },
  },
  { timestamps: true }
);

export const timeScheduleModel = models.Schedule || model('Schedule', scheduleModel);
