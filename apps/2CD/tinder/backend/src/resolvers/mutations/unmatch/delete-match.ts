import Match from 'src/models/match';

export const unMatched = async (_id: string) => {
  try {
    const result = await Match.findOneAndDelete({ _id });

    if (!result) {
      throw new Error('No matches found for this user');
    }

    return { success: true, message: `1 match unmatched successfully` };
  } catch (error) {
    console.error('Error not ', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    };
  }
};
