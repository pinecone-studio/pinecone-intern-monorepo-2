import { Table } from 'src/models/table-model';

export const createTable = async (_: unknown, { tableName, qrCodeUrl }: { tableName: string; qrCodeUrl?: string }) => {
  const newTable = new Table({ tableName, qrCodeUrl });
  await newTable.save();
  return newTable;
};
