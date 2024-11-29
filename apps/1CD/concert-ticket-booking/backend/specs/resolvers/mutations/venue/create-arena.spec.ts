import { GraphQLResolveInfo } from 'graphql';
import Venue from '../../../../src/models/venue.model';
import { createArena } from "../../../../src/resolvers/mutations/venue/create-venue";

jest.mock('../../../../src/models/venue.model', ()=>({
    create:jest.fn(),
}));

describe('createArena', ()=>{
    it('should create a arena when the arena is not created', async ()=> {
        (Venue.create as jest.Mock).mockResolvedValueOnce({
            _id:'1',
            name:'UG Arena',
            location:'Bayngol',
            image:'https://montsame.mn/files/63576773987c3.jpeg',
            capacity:'3000',
            size:'2800',
         });

        const result=await createArena?.({}, {
      input: {
        name:'UG Arena', 
        location:'Bayngol',
        image:'https://montsame.mn/files/63576773987c3.jpeg',
        capacity:'3000',
        size:'2800',
      }
        }, { userId: null }, {} as GraphQLResolveInfo);

        expect(result).toEqual({
            _id:'1',
            name:'UG Arena', 
            location:'Bayngol',
            image:'https://montsame.mn/files/63576773987c3.jpeg',
            capacity:'3000',
            size:'2800',
        });
    });
});
