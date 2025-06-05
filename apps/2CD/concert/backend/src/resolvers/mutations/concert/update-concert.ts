import { MutationResolvers, Response } from 'src/generated';
import { concertModel } from 'src/models';
import { updateConcertSchema } from 'src/zodSchemas';

export const updateConcert: MutationResolvers['updateConcert'] = async (_, { input }) => {
  const values = updateConcertSchema.parse(input);

  const concertInfo = await concertModel.findByIdAndUpdate(values.id, { ...values }, { new: true });
  if (!concertInfo) {
    throw new Error('Concert not found');
  }
  return Response.Success;
};
