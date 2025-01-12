import { QueryResolvers } from '../../../generated';
import { productModel, ProductPopulatedType } from '../../../models';

export const getProducts: QueryResolvers['getProducts'] = async (_, { options = {} }) => {
  const { filter } = options;

  const products = await productModel.find(filter).populate<ProductPopulatedType>('category');

  return products;
};
