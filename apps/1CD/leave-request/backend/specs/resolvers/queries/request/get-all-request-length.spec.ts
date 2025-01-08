import { GraphQLResolveInfo } from 'graphql';
import { getAllRequestLength } from 'src/resolvers/queries';

jest.mock('../../../../src/models/request', () => ({
  RequestModel: {
    countDocuments: jest.fn(),
  },
}));

const mockCountDocuments = jest.requireMock('../../../../src/models/request').RequestModel.countDocuments;

describe('getAllRequestLength Resolver', () => {
  const fixedDate = new Date('2023-01-01T00:00:00Z'); // Тестийн хувьд хэрэглэх хугацаа
  const commonParams = {
    supervisorEmail: 'amarjargal.ts01@gmail.com', // Баталгаажуулж буй supervisor-ийн email
    startDate: fixedDate, // Тестийн хугацаа
    endDate: fixedDate, // Тестийн хугацаа
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Тест бүрд mock-ийг цэвэрлэнэ
  });

  it.each([
    {
      params: { ...commonParams, status: ['sent'], search: 'example' }, // Шалгаж буй утгууд
      expected: { res: 2 }, // Хүлээгдэж буй үр дүн
    },
    {
      params: { ...commonParams, search: 'example' }, // status байхгүй
      expected: { res: 2 }, // Хүлээгдэж буй үр дүн
    },
    {
      params: commonParams, // Зөвхөн үндсэн параметрүүд
      expected: { res: 2 },
    },
    {
      params: { supervisorEmail: 'amarjargal.ts01@gmail.com' }, // зөвхөн supervisorEmail өгсөн
      expected: { res: 2 },
    },
  ])('should return correct request length for $params', async ({ params, expected }) => {
    mockCountDocuments.mockResolvedValue(2); // mockCountDocuments дуудагдахад 2 утга буцаж ирнэ

    const result = await getAllRequestLength!({}, params, {}, {} as GraphQLResolveInfo); // resolver-г дуудна

    expect(result).toEqual(expected); // Хүлээгдэж буй үр дүнтэй таарах эсэхийг шалгах
    expect(mockCountDocuments).toHaveBeenCalled(); // mockCountDocuments нь дуудагдсан эсэхийг шалгах
  });

  it('should return 0 when no documents match', async () => {
    mockCountDocuments.mockResolvedValue(0); // Хэрвээ таарах бичлэг байхгүй бол 0 утга буцна

    const result = await getAllRequestLength!({}, {}, {}, {} as GraphQLResolveInfo); // resolver-г дуудна
    expect(result).toEqual({ res: 0 }); // Үр дүн нь { res: 0 } байх ёстой
  });

  it('should throw an error on database failure', async () => {
    mockCountDocuments.mockRejectedValue(new Error('Database error')); // mockCountDocuments дуудагдахад алдаа үүснэ

    await expect(
      getAllRequestLength!({}, {}, {}, {} as GraphQLResolveInfo) // resolver-г дуудна
    ).rejects.toThrow('Database error'); // Алдаа гарах ёстой
  });
});
