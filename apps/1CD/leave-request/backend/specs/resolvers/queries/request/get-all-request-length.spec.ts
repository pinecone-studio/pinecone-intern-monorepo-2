import { GraphQLResolveInfo } from "graphql";
import { getAllRequestLength } from "src/resolvers/queries";



jest.mock('../../../../src/models/request', () => ({
    RequestModel: {
      find: jest.fn().mockResolvedValueOnce([
        [{
          email: 'zolookorzoloo@gmail.com',
        }],
      ]),
    },
  }));

  describe("find length of requests", ()=> {
    it("should get one request", async () => {
        const task = await getAllRequestLength!({}, {email: "asdfa", supervisorEmail: "asdf"} ,{} ,{} as GraphQLResolveInfo)
        expect(task).toEqual({res: 1})
    })
  })