import { GraphQLResolveInfo } from "graphql";
import Venue from '../../../../src/models/venue.model';
import { deleteArena } from '../../../../src/resolvers/mutations/venue/delete-venue';

jest.mock('../../../../src/models/venue.model', ()=>({
    findByIdAndDelete:jest.fn(),
}));

describe('deleteArena', ()=>{
    it('should delete venue by id', async ()=>{
        (Venue.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
            _id:'1',
        });

        const result = await deleteArena!({}, {
            _id: '1'
        }, {userId:null}, {} as GraphQLResolveInfo);

        expect(result).toEqual({
            _id:'1',
        });
    });
});