import { RequestModel } from 'src/models';
export const getAllRequists = async () => {
  try {
    const getAllRequists = await RequestModel.find();
    return getAllRequists;
  } catch (error) {
    throw new Error('Internal server error get all requists');
  }
};
