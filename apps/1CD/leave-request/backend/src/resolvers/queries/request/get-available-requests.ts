import { QueryResolvers } from 'src/generated';
import { RequestModel, UserModel } from 'src/models';
import { totalHours } from 'src/utils/calc-total-hours';

export const checkAvailablePaidLeaveInGivenYear: QueryResolvers['checkAvailablePaidLeaveInGivenYear'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const { thisYearDate, lastYearDate, nextYearDate } = getHireDateThisAndLastYear(user.hireDate);

  const thisYearAcceptedRequests = await RequestModel.find({ email, requestType: 'paid', requestDate: { $gte: lastYearDate, $lt: thisYearDate } });

  const totalLastYear = totalHours(thisYearAcceptedRequests);

  const nextYearAcceptedRequests = await RequestModel.find({ email, requestType: 'paid', requestDate: { $gte: thisYearDate, $lt: nextYearDate } });

  const totalThisYear = totalHours(nextYearAcceptedRequests);

  return { thisYear: 40 - totalLastYear, nextYear: 40 - totalThisYear };
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

  const thisYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: "remote",requestDate: { $gte: thisMonthDate, $lt: lastMonthDate } }).countDocuments();

  const nextYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: "remote", requestDate: { $gte: nextMonthDate, $lt: thisMonthDate } }).countDocuments();

  return { thisMonth: 5 - thisYearAcceptedRequests, nextMonth: 5 - nextYearAcceptedRequests };
};

const getHireDateThisAndLastMonth = (hireDate: Date) => {
  const today = new Date();

  const hireMonth = hireDate.getMonth();
  const hireDay = hireDate.getDate();

  const thisMonthDate = new Date(today.getFullYear(), hireMonth, hireDay);

  const lastMonthDate = new Date(today.getFullYear(), hireMonth - 1, hireDay);

  const nextMonthDate = new Date(today.getFullYear(), hireMonth + 1, hireDay);

  return { thisMonthDate, lastMonthDate, nextMonthDate };
};
