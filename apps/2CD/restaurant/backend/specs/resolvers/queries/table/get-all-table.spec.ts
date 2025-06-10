// __tests__/table.query.test.ts
import { Table } from 'src/models/table-model';
import { allTableQuery } from 'src/resolvers/queries/table/get-all-tables';

jest.mock('src/models/table-model', () => ({
  Table: {
    find: jest.fn(),
  },
}));

describe('allTableQuery', () => {
  it('should return tables matching the tableName', async () => {
    const mockTableName = '1A';
    const mockTables = [
      { tableName: '1A', qrCodeUrl: 'http://example.com/qr1' },
      { tableName: '1A', qrCodeUrl: 'http://example.com/qr2' },
    ];

    (Table.find as jest.Mock).mockResolvedValue(mockTables);

    const result = await allTableQuery(undefined, { tableName: mockTableName });

    expect(Table.find).toHaveBeenCalledWith({ tableName: mockTableName });
    expect(result).toEqual(mockTables);
  });
});
