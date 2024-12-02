import { GraphQLError } from 'graphql';
import { PaymentInput } from 'src/generated';
import { paymentMethodModel } from 'src/models';

export const addPayment = async (_: unknown, { input }: { input: PaymentInput }) => {
  try {
    const createdPayment = await paymentMethodModel.create({
      ...input,
      createdAt: new Date(),
    });
    return createdPayment;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
