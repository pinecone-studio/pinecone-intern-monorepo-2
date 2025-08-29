import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const updateEmergencyContact: NonNullable<MutationResolvers['updateEmergencyContact']> = async (_, { id, input }, _context) => {
  try {
    const updateData = Object.fromEntries(Object.entries(input).filter(([_, value]) => value !== undefined));

    const updatedEmergencyContactDoc = await EmergencyContactModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEmergencyContactDoc) {
      throw new GraphQLError('Emergency contact not found', {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    const emergencyContact = updatedEmergencyContactDoc.toObject();

    return {
      success: true,
      message: 'Emergency contact updated successfully',
      data: {
        id: emergencyContact._id.toString(),
        userId: emergencyContact.userId.toString(),
        name: emergencyContact.name,
        phone: emergencyContact.phone,
        relationship: emergencyContact.relationship,
        createdAt: emergencyContact.createdAt,
        updatedAt: emergencyContact.updatedAt,
      },
    };
  } catch (error) {
    console.error('Failed to update emergency contact:', error);
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError('Failed to update emergency contact', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', http: { status: 500 } },
    });
  }
};
