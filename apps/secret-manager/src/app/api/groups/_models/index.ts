import { Schema, model, models } from 'mongoose';

const SecretGroupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
  secrets: {
    test: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    prod: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    dev: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const SecretGroupModel = models['SecretGroup'] || model('SecretGroup', SecretGroupSchema);
