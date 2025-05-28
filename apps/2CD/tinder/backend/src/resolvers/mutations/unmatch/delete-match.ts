import Match from 'src/models/match';

export const unMatched = async (userId: string) => {
  try {
    const result = await Match.findOneAndDelete({ users: userId });

    if (!result) {
      throw new Error('No matches found for this user');
    }

    return { success: true, message: `1 match unmatched successfully` };
  } catch (error) {
    console.error("Error unmatching:", error);
  }
};
