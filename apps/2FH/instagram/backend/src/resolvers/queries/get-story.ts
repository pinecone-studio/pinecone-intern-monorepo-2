import {Story} from 'src/models'
import {Context} from '../../types/context'


export const StoryResolvers ={
    Query:{
        getStoryByUserId: async(_parent:unknown, {author}: {author: string}, context: Context) =>{
            if(!context.userId){
                throw new Error("Unauthorized");
            }
           const now = new Date();

           return await Story.find({
            author,
            expiredAt:{ $gt: now},
           }).populate('author')
        }
    }
}