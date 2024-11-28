import { MutationResolvers } from "../../../generated";
import Venue from "../../../models/venue.model";

export const deleteArena: MutationResolvers['deleteArena']=async(_, {_id})=>{
    const deleteVenue = await Venue.findByIdAndDelete(_id );
    return deleteVenue;
}