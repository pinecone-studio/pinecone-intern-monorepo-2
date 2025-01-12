import { QueryResolvers } from '../../../generated';
import { productModel, ProductPopulatedType } from '../../../models';

export const getProductById: QueryResolvers['getProductById'] = async (_, { _id }) => {
  const product = await productModel.findById(_id).populate<ProductPopulatedType>('category');

  if (!product) throw new Error('Product not found');

  return product as ProductPopulatedType;
};
