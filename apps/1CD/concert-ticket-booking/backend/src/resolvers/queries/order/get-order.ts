import { QueryResolvers } from "../../../generated";
import Order from "../../../models/order.model";

export const getOrder: QueryResolvers['getOrder']=async()=>{
    const getOrder=await Order.find({});
    return getOrder;
}