import { concertModel } from '../../models/concert.model';

export const validateConcert = async (concertId: string) => {
  const concert = await concertModel.findById(concertId);
  if (!concert) {
    throw new Error('Concert not found');
  }
};