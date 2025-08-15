
import { GraphQLError } from 'graphql';
import { MutationResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const updateEmergencyContact: MutationResolvers['updateEmergencyContact'] = async (_, { id, name, phone, relationship }, _context) => {
    try {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (relationship !== undefined) updateData.relationship = relationship;

      const updatedEmergencyContactDoc = await EmergencyContactModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
      
      if (!updatedEmergencyContactDoc) {
        throw new GraphQLError('Emergency contact not found');
      }

      // Convert Mongoose document to plain object and map to GraphQL schema
      const emergencyContact = updatedEmergencyContactDoc.toObject() as any;
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
        message: 'Emergency contact updated successfully',
        data: emergencyContactForGraphQL,
      };
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
      throw new GraphQLError('Failed to update emergency contact', {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          http: {
            status: 500,
          },
        },
      });
    }
  };