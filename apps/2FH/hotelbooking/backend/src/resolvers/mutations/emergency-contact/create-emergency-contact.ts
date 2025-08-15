import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const createEmergencyContact: MutationResolvers['createEmergencyContact'] = async (_, { name, phone, relationship, userId }, _context) => {
  try {
    const emergencyContactData = {
      name,
      phone,
      relationship,
      userId,
    };

    const createdEmergencyContactDoc = await EmergencyContactModel.create(emergencyContactData);
    if (!createdEmergencyContactDoc) {
      throw new GraphQLError('Failed to create emergency contact');
    }

    // Convert Mongoose document to plain object and map to GraphQL schema
    const emergencyContact = createdEmergencyContactDoc.toObject() as any;
    const emergencyContactForGraphQL = {
      id: emergencyContact._id.toString(),
      userId: emergencyContact.userId.toString(),
      name: emergencyContact.name,
      phone: emergencyContact.phone,
      relationship: emergencyContact.relationship,
      createdAt: emergencyContact.createdAt,
      updatedAt: emergencyContact.updatedAt,
    };

    return {
      success: true,
      message: 'Emergency contact created successfully',
      data: emergencyContactForGraphQL,
    };
  } catch (error) {
    console.error('Failed to create emergency contact:', error);
    throw new GraphQLError('Failed to create emergency contact', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
};