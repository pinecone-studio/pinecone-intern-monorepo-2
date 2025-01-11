import { roomsModel } from 'src/models';

export const updateRoomImage = async (_: unknown, { _id, images }: { _id: string; images: string[] }) => {
  const updateImages = await roomsModel.findByIdAndUpdate({ _id }, { images });
  return updateImages;
};
