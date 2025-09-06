import { GraphQLError } from 'graphql';
import { MutationResolvers,  SwipeResponse, SwipeResult, Match } from "src/generated";
import { Swipe, Profile,  } from "src/models";
import mongoose from 'mongoose';

// GraphQL swipe мутацийн резолвер
export const swipe: MutationResolvers["swipe"] = async (_, { input }): Promise<SwipeResult> => {
    const { swiperId, targetId, action } = input;

    // 1. Оруулсан өгөгдлийг шалгах
    if (swiperId === targetId) {
        return {
            success: false,
            message: 'Өөртөө swipe хийж болохгүй',
            response: SwipeResponse.Error,
        };
    }

    // 2. Өмнө нь swipe хийсэн эсэхийг шалгах
    const existingSwipe = await Swipe.findOne({ swiperId, targetId });
    if (existingSwipe) {
        return {
            success: false,
            message: 'Энд хэрэглэгчийг аль хэдийн swipe хийсэн байна',
            response: SwipeResponse.AlreadySwiped,
        };
    }

    // 3. Хэрэглэгчдийн профайлыг олох
    const [swiperProfile, targetProfile] = await Promise.all([
        Profile.findOne({ userId: swiperId }),
        Profile.findOne({ userId: targetId }),
    ]);

    if (!swiperProfile || !targetProfile) {
        return {
            success: false,
            message: 'Хэрэглэгч олдсонгүй',
            response: SwipeResponse.Error,
        };
    }

    // 4. Аль хэдийн match болсон эсэхийг шалгах
    if (swiperProfile.matches.includes(new mongoose.Types.ObjectId(targetId))) {
        return {
            success: false,
            message: 'Энд хэрэглэгчтэй аль хэдийн match болсон байна',
            response: SwipeResponse.AlreadySwiped,
        };
    }

    // 5. Swipe бичлэг үүсгэх
    const swipe = new Swipe({
        swiperId,
        targetId,
        action,
        swipedAt: new Date(),
    });

    // MongoDB транзакц эхлүүлэх
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let match: Match | undefined = undefined;

        // 6. Swipe-г хадгалах
        await swipe.save({ session });

        // 7. LIKE эсвэл SUPER_LIKE бол likes массивт нэмэх, match шалгах
        if (action === 'LIKE' || action === 'SUPER_LIKE') {
            // Target profile-ийн likes массивт swiperId нэмэх
            targetProfile.likes.push(new mongoose.Types.ObjectId(swiperId));
            await targetProfile.save({ session });

            // Харилцан LIKE эсвэл SUPER_LIKE шалгах
            const targetSwipe = await Swipe.findOne({
                swiperId: targetId,
                targetId: swiperId,
                action: { $in: ['LIKE', 'SUPER_LIKE'] },
            }).session(session);

            if (targetSwipe) {
                // Match болсон: хоёр талын matches массивт нэмэх
                swiperProfile.matches.push(new mongoose.Types.ObjectId(targetId));
                targetProfile.matches.push(new mongoose.Types.ObjectId(swiperId));
                await Promise.all([
                    swiperProfile.save({ session }),
                    targetProfile.save({ session }),
                ]);

                match = {
                    id: new mongoose.Types.ObjectId().toString(),
                    likeduserId: swiperProfile as any,
                    matcheduserId: targetProfile as any,
                    matchedAt: new Date(),
                };
            }
        }

        // Транзакцыг баталгаажуулах
        await session.commitTransaction();

        return {
            success: true,
            message: match ? 'Match боллоо!' : 'Swipe амжилттай хийгдлээ',
            response: match ? SwipeResponse.MatchCreated : SwipeResponse.Success,
            match,
        };
    } catch (error) {
        await session.abortTransaction();
        throw new GraphQLError(error instanceof Error ? error.message : 'Алдаа гарлаа', {
            extensions: { code: 'ERROR' },
        });
    } finally {
        session.endSession();
    }
};