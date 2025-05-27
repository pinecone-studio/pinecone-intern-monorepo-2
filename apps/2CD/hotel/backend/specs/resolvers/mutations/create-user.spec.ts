// import mongoose from 'mongoose';
// import { ApolloServer, BaseContext } from '@apollo/server';
// import { startStandaloneServer } from '@apollo/server/standalone';
// import { typeDefs } from 'src/schemas';
// import { resolvers } from 'src/resolvers';
// import { User } from 'src/models/user';
// import dotenv from 'dotenv';

// dotenv.config({ path: '.env.test' });

// let server: ApolloServer;

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGODB_URI as string);
//   server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });
//   await server.start(); 
// });

// afterAll(async () => {
//   await mongoose.disconnect();
// //   await server.stop();
// });

// afterEach(async () => {
//   await User.deleteMany({});
// });

// const CREATE_USER_MUTATION = `
//   mutation CreateUser($input: CreateUserInput!) {
//     createUser(input: $input) {
//       _id
//       email
//       phoneNumber
//       role
//     }
//   }
// `;

// describe('createUser mutation (real MongoDB)', () => {
//   it('should create a new user', async () => {
//     const { executeOperation } = createTestClient(server);

//     const result = await executeOperation({
//       query: CREATE_USER_MUTATION,
//       variables: {
//         input: {
//           email: 'test@example.com',
//           password: 'test123',
//           phoneNumber: '1234567890',
//           role: 'USER',
//         },
//       },
//     });

//     expect(result.errors).toBeUndefined();
//     expect(result.data?.createUser.email).toBe('test@example.com');
//   });

//   it('should fail on duplicate email', async () => {
//     await User.create({
//       email: 'test@example.com',
//       password: 'dummy',
//       phoneNumber: '0000000000',
//       role: 'USER',
//     });

//     const { executeOperation } = createTestClient(server);

//     const result = await executeOperation({
//       query: CREATE_USER_MUTATION,
//       variables: {
//         input: {
//           email: 'test@example.com',
//           password: 'newpass',
//           phoneNumber: '1111111111',
//           role: 'USER',
//         },
//       },
//     });

//     expect(result.errors?.[0].message).toContain('already exists');
//   });
// });
// function createTestClient(server: ApolloServer<BaseContext>): { executeOperation: any; } {
//     throw new Error('Function not implemented.');
// }

