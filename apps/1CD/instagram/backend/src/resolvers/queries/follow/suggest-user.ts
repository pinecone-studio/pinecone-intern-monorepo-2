// import { QueryResolvers } from 'src/generated';

// import { FollowerPopulatedType, followModel, FollowPopulatedType } from 'src/models/follow.model';

// export const suggestUser: QueryResolvers['getSuggestUser'] = async (_, __, { userId }) => {
//   if (!userId) throw new Error('Unauthorized');
//   const myFollowingInfo = await followModel.find({ followerId: userId }).populate<FollowPopulatedType>('followingId').populate<FollowerPopulatedType>('followerId');
//   const myFollowingInfo1 = await followModel.aggregate([
//     {
//       $match: { followerId: userId },
//     },
//   ]);
//   console.log('myFollowingInfo1', myFollowingInfo1);

//   return myFollowingInfo as [];
// };

// const universities = [
//   {
//     country: 'Spain',
//     city: 'Salamanca',
//     name: 'USAL',
//     location: {
//       type: 'Point',
//       coordinates: [-5.6722512, 17, 40.9607792],
//     },
//     students: [
//       { year: 2014, number: 24774 },
//       { year: 2015, number: 23166 },
//       { year: 2016, number: 21913 },
//       { year: 2017, number: 21715 },
//     ],
//   },
//   {
//     country: 'Spain',
//     city: 'Salamanca',
//     name: 'UPSA',
//     location: {
//       type: 'Point',
//       coordinates: [-5.6691191, 17, 40.9631732],
//     },
//     students: [
//       { year: 2014, number: 4788 },
//       { year: 2015, number: 4821 },
//       { year: 2016, number: 6550 },
//       { year: 2017, number: 6125 },
//     ],
//   },
// ];
// const couse = [
//   {
//     university: 'USAL',
//     name: 'Computer Science',
//     level: 'Excellent',
//   },
//   {
//     university: 'USAL',
//     name: 'Electronics',
//     level: 'Intermediate',
//   },
//   {
//     university: 'USAL',
//     name: 'Communication',
//     level: 'Excellent',
//   },
// ];
