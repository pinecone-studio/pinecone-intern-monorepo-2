import Order from "../../../../src/models/order.model";
import { deleteOrder } from "../../../../src/resolvers/mutations/order/delete-order";
import { GraphQLResolveInfo } from "graphql";

jest.mock('../../../../src/models/order.model', ()=>({
    findOneAndDelete:jest.fn(),
}));

describe('deleteOrder', ()=>{
    it('should delete order by id', async ()=>{
        (Order.findOneAndDelete as jest.Mock).mockResolvedValueOnce({
            _id:'1',
        });

        const result=await deleteOrder!({}, {_id:'1'}, {userId:null}, {} as GraphQLResolveInfo);
        expect(result).toEqual({
            _id:'1',
        });
    });
    it('should throw an error if the order does not exist', async()=>{
       await expect(deleteOrder!({}, {_id:'1'}, {userId:null}, {} as GraphQLResolveInfo)).rejects.toThrow('Order not found');
    })
});