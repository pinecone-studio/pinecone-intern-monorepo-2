import { QueryResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const getAllEmergencyContacts: QueryResolvers['getAllEmergencyContacts'] = async () => {
  try {
    const emergencyContactDocs = await EmergencyContactModel.find({});

    if (!emergencyContactDocs || emergencyContactDocs.length === 0) {
      return {
        success: true,
        message: 'No emergency contacts found.',
        data: [],
      };
    }

    const formattedData = emergencyContactDocs.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      name: doc.name,
      phone: doc.phone,
      relationship: doc.relationship,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return {
      success: true,
      message: 'All emergency contacts retrieved successfully.',
      data: formattedData,
    };
  } catch (error) {
    console.error('Failed to get all emergency contacts:', error);
    return {
      success: false,
      message: 'An internal server error occurred.',
      data: [],
    };
  }
};

