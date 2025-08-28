import { MutationResolvers } from 'src/generated';
import { EmergencyContactModel } from 'src/models';

export const deleteEmergencyContact: MutationResolvers['deleteEmergencyContact'] = async (
  _,
  { id },
  _context
) => {
  try {
   
    const deletedContact = await EmergencyContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      return {
        success: false,
        message: 'Emergency Contact not found.',
      };
    }

    return {
      success: true,
      message: 'Emergency Contact deleted successfully.',
    };
  } catch (error) {
    console.error('Failed to delete Emergency Contact:', error);
    
    return {
        success: false,
        message: 'An internal server error occurred while deleting the Emergency Contact.',
    };
  }
};