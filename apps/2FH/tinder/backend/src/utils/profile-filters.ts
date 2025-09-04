// Helper function to build gender filter based on user's interestedIn preference
export const buildGenderFilter = (userInterestedIn: string): any => {
  if (userInterestedIn === "male") {
    return { gender: "male" };
  } else if (userInterestedIn === "female") {
    return { gender: "female" };
  } else if (userInterestedIn === "both") {
    return { gender: { $in: ["male", "female"] } };
  }
  return {};
};

// Helper function to build interestedIn filter based on user's gender
export const buildInterestedInFilter = (userGender: string): any => {
  if (userGender === "male") {
    return { 
      $or: [
        { interestedIn: "male" },
        { interestedIn: "both" }
      ]
    };
  } else if (userGender === "female") {
    return { 
      $or: [
        { interestedIn: "female" },
        { interestedIn: "both" }
      ]
    };
  } else if (userGender === "both") {
    return { 
      $or: [
        { interestedIn: "male" },
        { interestedIn: "female" },
        { interestedIn: "both" }
      ]
    };
  }
  return {};
};