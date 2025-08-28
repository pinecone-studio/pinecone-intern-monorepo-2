import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const createEmergencyContact: MutationResolvers['createEmergencyContact'] = async (
  _, 
  { input },
  _context
) => {
  try {
    const createdEmergencyContactDoc = await EmergencyContactModel.create(input);

    if (!createdEmergencyContactDoc) {
      throw new GraphQLError('Failed to create emergency contact - database error');
    }

    return {
      success: true,
      message: 'Emergency contact created successfully',
      data: {
        id: createdEmergencyContactDoc._id.toString(),
        userId: createdEmergencyContactDoc.userId.toString(),
        name: createdEmergencyContactDoc.name,
        phone: createdEmergencyContactDoc.phone,
        relationship: createdEmergencyContactDoc.relationship,
        createdAt: createdEmergencyContactDoc.createdAt,
        updatedAt: createdEmergencyContactDoc.updatedAt,
      },
    };
  } catch (error) { 
    console.error('=== ERROR in createEmergencyContact ===');
    console.error('Error:', error);
    
    if (error instanceof GraphQLError) {
      throw error;
    }
    
    throw new GraphQLError('Failed to create emergency contact', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
};
