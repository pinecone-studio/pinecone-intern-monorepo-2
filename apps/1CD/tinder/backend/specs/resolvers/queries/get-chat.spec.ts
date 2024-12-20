import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { getChat } from "../../../src/resolvers/queries";
import { Chatmodel } from "../../../src/models";
import { Messagemodel } from "../../../src/models/tinderchat/message.model";

jest.mock ('../../../src/models/tinderchat/message.model', ()=>({
    Messagemodel:{
        find:jest.fn()
    }
}))
jest.mock ('../../../src/models', ()=>({
    Chatmodel:{
        findOne:jest.fn()
    }
}))
describe ('get chats', ()=>{
    const mockChatResponse = {
        _id: '6747bf86eef691c549c23463',
        participants: ['6757b696595465df6d4fcc86', '6757b696595465df6d4fcc84'],
      };

      const mockMessageResponse = {
        _id: '6747bf86aaf691c549c23464',
        chatId: mockChatResponse._id,
        content: 'Hi, untaach!',
        senderId: '6757b696595465df6d4fcc86',
      };
  
    const input ={
        user2:"6757b696595465df6d4fcc84"
    }
    const userId = '6757b696595465df6d4fcc86'
    it('If there is previous chat it should return previous chat', async ()=>{
        (Chatmodel.findOne as jest.Mock).mockResolvedValue(mockChatResponse);
        (Messagemodel.find as jest.Mock).mockResolvedValue([mockMessageResponse])
    
        expect(await getChat!({},{input}, {userId}, {} as GraphQLResolveInfo )).toEqual([mockMessageResponse])
    })

    it('It should throw error when could not get chat', async ()=>{
        (Chatmodel.findOne as jest.Mock).mockResolvedValue(null)
        await expect(getChat!({},{input}, {userId}, {} as GraphQLResolveInfo )).rejects.toThrowError(
            new GraphQLError('Error occured: Could not find chat')
        )
    })

    it('It should throw error when internal server error occured', async ()=>{
        (Chatmodel.findOne as jest.Mock).mockRejectedValue(new Error('Internal server error'))
        await expect(getChat!({},{input}, {userId}, {} as GraphQLResolveInfo )).rejects.toThrowError(
            new GraphQLError('Error occured: Error: Internal server error')
        )
    })
   
})