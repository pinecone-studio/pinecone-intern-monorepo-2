import mongoose from 'mongoose';
import { Profile, Match, Swipe } from '../src/models/index';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tinder', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Function to validate if two users actually have a mutual match
const validateMutualMatch = async (userId1, userId2) => {
    try {
        // Check if user1 liked user2
        const like1 = await Swipe.findOne({
            swiperId: userId1,
            targetId: userId2,
            action: 'LIKE'
        });

        // Check if user2 liked user1
        const like2 = await Swipe.findOne({
            swiperId: userId2,
            targetId: userId1,
            action: 'LIKE'
        });

        // Check if there's a match record
        const matchRecord = await Match.findOne({
            $or: [
                { likeduserId: userId1, matcheduserId: userId2 },
                { likeduserId: userId2, matcheduserId: userId1 }
            ]
        });

        return !!(like1 && like2 && matchRecord);
    } catch (error) {
        console.error('Error validating mutual match:', error);
        return false;
    }
};

// Function to clean up matches for a specific user
const cleanupUserMatches = async (userId) => {
    try {
        console.log(`\nCleaning up matches for user: ${userId}`);

        const profile = await Profile.findOne({ userId });
        if (!profile) {
            console.log('Profile not found');
            return;
        }

        console.log(`Current matches count: ${profile.matches.length}`);

        const validMatches = [];

        // Check each match to see if it's actually a mutual match
        for (const matchId of profile.matches) {
            const isValid = await validateMutualMatch(userId, matchId);
            if (isValid) {
                validMatches.push(matchId);
                console.log(`✓ Valid match: ${matchId}`);
            } else {
                console.log(`✗ Invalid match removed: ${matchId}`);
            }
        }

        // Update the profile with only valid matches
        await Profile.findOneAndUpdate(
            { userId },
            { matches: validMatches }
        );

        console.log(`Updated matches count: ${validMatches.length}`);

    } catch (error) {
        console.error('Error cleaning up user matches:', error);
    }
};

// Function to clean up all profiles
const cleanupAllMatches = async () => {
    try {
        console.log('Starting match cleanup for all profiles...');

        const profiles = await Profile.find({});
        console.log(`Found ${profiles.length} profiles to check`);

        for (const profile of profiles) {
            await cleanupUserMatches(profile.userId);
        }

        console.log('\nMatch cleanup completed!');

    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};

// Main execution
const main = async () => {
    await connectDB();

    // Get the specific user ID from command line arguments
    const targetUserId = process.argv[2];

    if (targetUserId) {
        // Clean up specific user
        await cleanupUserMatches(targetUserId);
    } else {
        // Clean up all users
        await cleanupAllMatches();
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
};

// Run the script
main().catch(console.error);