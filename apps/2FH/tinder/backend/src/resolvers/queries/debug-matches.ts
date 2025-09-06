import { QueryResolvers } from '../../generated';
import { Profile, Match, Swipe } from '../../models';
import { Types } from 'mongoose';

export const debugMatches: QueryResolvers['debugMatches'] = async (
    _parent,
    { userId },
    _context
) => {
    try {
        console.log(`Debug matches called for userId: ${userId}`);

        // Get the user's profile
        const profile = await Profile.findOne({ userId: new Types.ObjectId(userId) });
        if (!profile) {
            return {
                success: false,
                message: 'Profile not found',
                data: undefined
            };
        }

        console.log(`Profile found: ${profile.name}`);
        console.log(`Matches count: ${profile.matches.length}`);
        console.log(`Likes count: ${profile.likes.length}`);

        // Analyze each match
        const matchAnalysis = [];

        for (let i = 0; i < profile.matches.length; i++) {
            const matchId = profile.matches[i];
            console.log(`\nAnalyzing match ${i + 1}: ${matchId}`);

            // Get the matched user's profile
            const matchedProfile = await Profile.findOne({ userId: matchId });
            if (!matchedProfile) {
                matchAnalysis.push({
                    matchId: matchId.toString(),
                    matchedUserName: 'Profile not found',
                    userLikedMatch: false,
                    matchLikedUser: false,
                    matchRecordExists: false,
                    isValid: false,
                    reason: 'Matched user profile not found'
                });
                continue;
            }

            // Check if user liked the matched person
            const userLikedMatch = await Swipe.findOne({
                swiperId: new Types.ObjectId(userId),
                targetId: matchId,
                action: 'LIKE'
            });

            // Check if matched person liked the user
            const matchLikedUser = await Swipe.findOne({
                swiperId: matchId,
                targetId: new Types.ObjectId(userId),
                action: 'LIKE'
            });

            // Check if there's a match record
            const matchRecord = await Match.findOne({
                $or: [
                    { likeduserId: new Types.ObjectId(userId), matcheduserId: matchId },
                    { likeduserId: matchId, matcheduserId: new Types.ObjectId(userId) }
                ]
            });

            const isValidMatch = !!(userLikedMatch && matchLikedUser && matchRecord);

            matchAnalysis.push({
                matchId: matchId.toString(),
                matchedUserName: matchedProfile.name,
                userLikedMatch: !!userLikedMatch,
                matchLikedUser: !!matchLikedUser,
                matchRecordExists: !!matchRecord,
                isValid: isValidMatch,
                reason: isValidMatch ? 'Valid mutual match' : 'Invalid match - missing mutual likes or match record'
            });
        }

        return {
            success: true,
            message: `Analyzed ${profile.matches.length} matches`,
            data: {
                profileName: profile.name,
                totalMatches: profile.matches.length,
                totalLikes: profile.likes.length,
                matchAnalysis
            }
        };

    } catch (error) {
        console.error('Error in debugMatches:', error);
        return {
            success: false,
            message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            data: undefined
        };
    }
};