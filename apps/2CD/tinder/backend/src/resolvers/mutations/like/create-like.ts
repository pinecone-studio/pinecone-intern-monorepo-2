import Like from "src/models/like";
import Match from "src/models/match";
import Message from "src/models/message";
import User from "src/models/user";

export const createLike = async (_: any, args: { from: string; to: string }) => {
  

  const existingLike = await Like.findOne({ from: args.from, to: args.to });
  if (existingLike) {
    throw new Error("Like already exists");
  }

  try {
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

      await Promise.all([
        User.findByIdAndUpdate(
          args.from,
          { $addToSet: { matches: createMatch._id } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          args.to,
          { $addToSet: { matches: createMatch._id } },
          { new: true }
        ),
      ]);

      await Message.create({
        match: createMatch._id,
        sender: args.from,
        content: "It's a match!",
      });
    }

    return await newLike.populate("from").populate("to");
  } catch (error) {
    throw new Error("Failed to create like: ");
  }
};
