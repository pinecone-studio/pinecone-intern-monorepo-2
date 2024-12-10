import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { getChat } from "../../../src/resolvers/queries";
import { Messagemodel } from "../../../src/models/tinderchat/message.model";

jest.mock ('../../../src/models/tinderchat/message.model', ()=>({
    Messagemodel:{
        find:jest.fn()
    }
}))
describe ('get chats', ()=>{
    const chatResponse = {
        _id:"6757b696595465df6d4fcc85",
        content: "hi untaach",
        senderId: "1234"
    }
    const input ={
        _id:"6757b696595465df6d4fcc85"
    }
    it('It should throw error when could not get chat', async ()=>{
        (Messagemodel.find as jest.Mock).mockResolvedValue(null)
        await expect(getChat!({},{input}, {}, {} as GraphQLResolveInfo )).rejects.toThrowError(
            new GraphQLError('Could not find chat')
        )
    })
    it('It should get chats associated with chatId', async ()=>{
        (Messagemodel.find as jest.Mock).mockResolvedValue(chatResponse)
        expect(await getChat!({},{input}, {}, {} as GraphQLResolveInfo )).toEqual(chatResponse)
    })
})