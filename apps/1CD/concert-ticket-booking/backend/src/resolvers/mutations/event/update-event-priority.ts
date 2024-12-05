import { GraphQLResolveInfo } from 'graphql';
import { MutationResolvers } from '../../../generated';
import Event from '../../../models/event.model';


export const updateEventPriority: MutationResolvers['updateEventPriority'] = async (_, { input, _id }) => {
  const { priority} = input;
  // console.log({_id, input})

  const updatedEvent = await Event.findByIdAndUpdate({_id},{priority});

  if (!updatedEvent) {
    throw new Error('Event not found');
  }

  return updatedEvent;
 
};



// jest.mock ('../../../../src/models/event.model', ()=> ({
//   findByIdAndUpdate: jest.fn(),
// }));

// describe ('update priority', ()=> {
//   const input = {
//     priority : "test"
//   }; 
//   const _id = '1' 
//   it ('should update priority', async ()=> {
//     (Event.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
//       _id: '1', 
//       priority: 'test'
//     })
//     const result = await updateEvent! ({}, {input, _id}, {userId: '1'}, {} as GraphQLResolveInfo);
//     expect (result ). toEqual ({
//       _id: "1",
//       priority: "test"
//     });
//   });

// })