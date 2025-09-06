import mongoose from 'mongoose';
import { Profile, Match, Swipe } from '../src/models/index';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tinder');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to analyze a specific user's matches
const analyzeUserMatches = async (userId: string) => {
  try {
    console.log(`\n=== Analyzing matches for user: ${userId} ===`);

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      console.log('Profile not found');
      return;
    }

    console.log(`Profile name: ${profile.name}`);
    console.log(`Total matches in profile: ${profile.matches.length}`);
    console.log(`Total likes in profile: ${profile.likes.length}`);

    // Check each match
    for (let i = 0; i < profile.matches.length; i++) {
      const matchId = profile.matches[i];
      console.log(`\n--- Match ${i + 1}: ${matchId} ---`);

      // Get the matched user's profile
      const matchedProfile = await Profile.findOne({ userId: matchId });
      if (matchedProfile) {
        console.log(`Matched user name: ${matchedProfile.name}`);
      } else {
        console.log('Matched user profile not found!');
        continue;
      }

      // Check if user liked the matched person
      const userLikedMatch = await Swipe.findOne({
        swiperId: userId,
        targetId: matchId,
        action: 'LIKE'
      });
      console.log(`User liked this person: ${!!userLikedMatch}`);

      // Check if matched person liked the user
      const matchLikedUser = await Swipe.findOne({
        swiperId: matchId,
        targetId: userId,
        action: 'LIKE'
      });
      console.log(`This person liked user: ${!!matchLikedUser}`);

      // Check if there's a match record
      const matchRecord = await Match.findOne({
        $or: [
          { likeduserId: userId, matcheduserId: matchId },
          { likeduserId: matchId, matcheduserId: userId }
        ]
      });
      console.log(`Match record exists: ${!!matchRecord}`);

      // Determine if this is a valid mutual match
      const isValidMatch = !!(userLikedMatch && matchLikedUser && matchRecord);
      console.log(`Valid mutual match: ${isValidMatch}`);

      if (!isValidMatch) {
        console.log('❌ INVALID MATCH - This should be removed!');
      } else {
        console.log('✅ Valid match');
      }
    }

  } catch (error) {
    console.error('Error analyzing user matches:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();

  // Get the specific user ID from command line arguments
  const targetUserId = process.argv[2];

  if (targetUserId) {
    await analyzeUserMatches(targetUserId);
  } else {
    console.log('Please provide a user ID as an argument');
    console.log('Usage: node check-matches.js <userId>');
  }

  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
};

// Run the script
main().catch(console.error);