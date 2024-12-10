import { QueryResolvers } from 'src/generated';
import { RequestModel, UserModel } from 'src/models';

export const checkAvailablePaidLeaveInGivenYear: QueryResolvers['checkAvailablePaidLeaveInGivenYear'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const { thisYearDate, lastYearDate, nextYearDate } = getHireDateThisAndLastYear(user.hireDate);

  const thisYearAcceptedRequests = await RequestModel.find({ email, result: 'paid', requestDate: { $in: [thisYearDate, lastYearDate] } }).countDocuments();

  const nextYearAcceptedRequests = await RequestModel.find({ email, result: 'paid', requestDate: { $in: [nextYearDate, thisYearDate] } }).countDocuments();

  return { thisYear: 5 - thisYearAcceptedRequests, nextYear: 5 - nextYearAcceptedRequests };
};

const getHireDateThisAndLastYear = (hireDate: Date) => {
  const today = new Date();

  const hireMonth = hireDate.getMonth();
  const hireDay = hireDate.getDate();

  const thisYearDate = new Date(today.getFullYear(), hireMonth, hireDay);

  const lastYearDate = new Date(today.getFullYear() - 1, hireMonth, hireDay);

  const nextYearDate = new Date(today.getFullYear() + 1, hireMonth, hireDay);

  return { thisYearDate, lastYearDate, nextYearDate };
};

export const checkAvailavleRemoteLeaveInGivenMonth: QueryResolvers['checkAvailavleRemoteLeaveInGivenMonth'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }
  const { thisMonthDate, lastMonthDate, nextMonthDate } = getHireDateThisAndLastMonth(user.hireDate);

  const thisYearAcceptedRequests = await RequestModel.find({ email, result: 'paid', requestDate: { $in: [thisMonthDate, lastMonthDate] } }).countDocuments();

  const nextYearAcceptedRequests = await RequestModel.find({ email, result: 'paid', requestDate: { $in: [nextMonthDate, thisMonthDate] } }).countDocuments();

  return { thisMonth: 5 - thisYearAcceptedRequests, nextMonth: 5 - nextYearAcceptedRequests };
};

const getHireDateThisAndLastMonth = (hireDate : Date) => {
    const today = new Date();

  const hireMonth = hireDate.getMonth();
  const hireDay = hireDate.getDate();

  const thisMonthDate = new Date(today.getFullYear(), hireMonth, hireDay);

  const lastMonthDate = new Date(today.getFullYear(), hireMonth - 1, hireDay);

  const nextMonthDate = new Date(today.getFullYear(), hireMonth + 1, hireDay);

  return {thisMonthDate, lastMonthDate, nextMonthDate}
}