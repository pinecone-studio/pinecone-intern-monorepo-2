import{model, models, Schema} from 'mongoose'

export type Matchmodel = {
    user1 : String
    user2: String
    matched: Boolean
}
const Matchschema= new Schema<Matchmodel>({
    user1:{
        type:String,
        required:true
    },
    user2:{
        type:String,
        required:true
    }, 
    matched:{
        type: Boolean
    }
})
export const Matchmodel = models ['match'] || model ('Match', Matchschema)