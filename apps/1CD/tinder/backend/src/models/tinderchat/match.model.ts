import{model, models, Schema} from 'mongoose'

export type Matchmodel = {
    user1 : string
    user2: string
    matched: boolean
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