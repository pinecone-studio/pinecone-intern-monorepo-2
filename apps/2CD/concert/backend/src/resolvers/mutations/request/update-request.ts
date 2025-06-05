import { MutationResolvers, RequestStatus, Response } from 'src/generated';
import { RequestModel } from 'src/models';
import { updateReqZod } from 'src/zodSchemas';

export const updateRequest: MutationResolvers['updateRequest'] = async (_, { input }) => {
  const values = updateReqZod.parse(input);
  const updateReq = await RequestModel.findById(values.id);
  if (!updateReq) {
    throw new Error('Request not found');
  }

  await RequestModel.findByIdAndUpdate(values.id, { status: RequestStatus.Done }, { new: true });

  return Response.Success;
};
