import { QueryResolvers } from "src/generated";
import { RequestModel, UserModel } from "src/models";


export const checkAvailablePaidLeave : QueryResolvers['checkAvailablePaidLeave'] = async (_, {email}) => {

    const user = await UserModel.findOne({email})

    if (!user){
        throw new Error("User not found")
    }

    const { thisYearDate, lastYearDate } = getHireDateThisAndLastYear(user.hireDate);

    const acceptedRequests = await RequestModel.find({email, result: 'paid'}).countDocuments()

    return years * 5 - acceptedRequests
}

const getHireDateThisAndLastYear = (hireDate: Date) => {
    const today = new Date();
    
    const hireMonth = hireDate.getMonth(); 
    const hireDay = hireDate.getDate(); 
    
    const thisYearDate = new Date(today.getFullYear(), hireMonth, hireDay);
    
    const lastYearDate = new Date(today.getFullYear() - 1, hireMonth, hireDay);
    
    return { thisYearDate, lastYearDate };
  };