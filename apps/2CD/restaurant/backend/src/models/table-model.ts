import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableName: { type: String, required: true },
  qrCodeUrl: { type: String },
});
export const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);
