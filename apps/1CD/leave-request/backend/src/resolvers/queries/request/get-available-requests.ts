import { QueryResolvers } from 'src/generated';
import { Request, RequestModel, UserModel } from 'src/models';

export const checkAvailablePaidLeaveInGivenYear: QueryResolvers['checkAvailablePaidLeaveInGivenYear'] = async (_, { email }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  const { thisYearDate, lastYearDate, nextYearDate } = getHireDateThisAndLastYear(user.hireDate);

  const thisYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: 'paid', requestDate: { $in: [thisYearDate, lastYearDate] } });

  console.log("thisYearAcceptedRequests       ", thisYearAcceptedRequests)

  const totalLastYear = totalHours(thisYearAcceptedRequests);

  const nextYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: 'paid', requestDate: { $in: [nextYearDate, thisYearDate] } });

  const totalThisYear = totalHours(nextYearAcceptedRequests);

  return { thisYear: 40 - totalLastYear, nextYear: 40 - totalThisYear };
};

const totalHours = (list: Request[]) => {
  let totalHours = 0;
  for (let i = 0; i < list.length; i++) {
    const { startTime, endTime } = list[i];
    if (startTime) {
      totalHours += endTime!.getHours() - startTime.getHours();
    } else {
      totalHours += 8;
    }
  }
  return totalHours;
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

  const thisYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: "remote",requestDate: { $in: [thisMonthDate, lastMonthDate] } }).countDocuments();

  const nextYearAcceptedRequests = await RequestModel.find({ email, result: 'success', requestType: "remote", requestDate: { $in: [nextMonthDate, thisMonthDate] } }).countDocuments();

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
