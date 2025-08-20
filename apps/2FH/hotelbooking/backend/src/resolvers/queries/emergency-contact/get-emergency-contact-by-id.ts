import { GraphQLError } from 'graphql';
import { QueryResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const getEmergencyContact: QueryResolvers['getEmergencyContact'] = async (
  _,
  { id },
  _context
) => {
  try {
    const doc = await EmergencyContactModel.findById(id);

    if (!doc) {
      throw new GraphQLError('Emergency contact not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: { status: 404 },
        },
      });
    }

    return {
      success: true,
      message: 'Emergency contact retrieved successfully',
      data: {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        name: doc.name,
        phone: doc.phone,
        relationship: doc.relationship,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    };
  } catch (error) {
    console.error('Failed to get emergency contact:', error);

    if (error instanceof GraphQLError) {
      throw error; // rethrow specific GraphQLErrors untouched
    }

    throw new GraphQLError('Emergency contact not found', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: { status: 500 },
      },
    });
  }
};
