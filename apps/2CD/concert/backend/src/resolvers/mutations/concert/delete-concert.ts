import { MutationResolvers, Response } from 'src/generated';
import { concertModel } from 'src/models';
import { updateConcertSchema } from 'src/zodSchemas';

export const deleteConcert: MutationResolvers['deleteConcert'] = async (_, { input }) => {
  const values = updateConcertSchema.parse(input);
  const deletedConcert = await concertModel.findByIdAndDelete(values.id);
  if (!deletedConcert) {
    throw new Error('Concert not found');
  }
  return Response.Success;
};
