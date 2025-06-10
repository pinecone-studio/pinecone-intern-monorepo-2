import { Table } from 'src/models/table-model';
import { createTable } from 'src/resolvers/mutations/table/create-table';

jest.mock('src/models/table-model', () => ({
  Table: jest.fn(),
}));

describe('createTable', () => {
  it('should create and return a new table', async () => {
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockTableData = {
      tableName: '1A',
      qrCodeUrl: 'https://example.com/qr',
      save: mockSave,
    };

    (Table as unknown as jest.Mock).mockImplementation(() => mockTableData);

    const result = await createTable(undefined, {
      tableName: '1A',
      qrCodeUrl: 'https://example.com/qr',
    });

    expect(Table).toHaveBeenCalledWith({
      tableName: '1A',
      qrCodeUrl: 'https://example.com/qr',
    });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockTableData);
  });
});
