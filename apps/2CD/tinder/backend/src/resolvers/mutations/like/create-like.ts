import Like from "src/models/like";
import Match from "src/models/match";
import Message from "src/models/message";

export const createLike = async (_: any, args: { from: string; to: string }) => {
    //   await connectToDb();
    try {
        const existingLike = await Like.findOne({ from: args.from, to: args.to });
        if (existingLike) {
            throw new Error("Like already exists");
        }

        const newLike = await Like.create({
            from: args.from,
            to: args.to,
            createdAt: new Date(),
        });

        const mutualLike = await Like.findOne({
            from: args.to,
            to: args.from,
        });

        if (mutualLike) {
            const createMatch = await Match.create({
               users: [args.from, args.to],
            });
            
            await Message.create({
                match: createMatch._id,
                sender: args.from,
                content: "It's a match!",
            });
        }

        return await newLike.populate("from").populate("to");
    } catch (error) {
  console.error("Error creating like:", error); 
  throw new Error("Failed to create like: ");
}}

