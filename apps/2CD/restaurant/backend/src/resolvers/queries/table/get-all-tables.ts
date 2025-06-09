import { Table } from 'src/models/table-model';

export const allTableQuery = async (_: unknown, arg: { tableName: string }) => {
  const { tableName } = arg;
  const allTables = await Table.find({ tableName });
  return allTables;
};
