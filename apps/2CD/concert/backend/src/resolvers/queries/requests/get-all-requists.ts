import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';
export const getAllRequists: QueryResolvers['getAllRequists'] = async () => {
  const docs = await RequestModel.find().populate('booking').populate('user');
  return docs.map((doc) => ({
    id: doc.id,
    booking: doc.booking,
    user: doc.user,
    status: doc.status,
    bank: doc.bank,
    bankAccount: doc.bankAccount,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
};
