import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

// eslint-disable-next-line complexity
export const leaveCalendar: QueryResolvers['leaveCalendar'] = async (_, { startDate, endDate }) => {
  // Function to generate an array of all dates between startDate and endDate
  function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split('T')[0].slice(5)); // Format: YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  const dateRange = generateDateRange(startDate, endDate);

  const request = await RequestModel.aggregate([
    {
      $match: {
        requestDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        result: 'success',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'email',
        foreignField: 'email',
        as: 'email',
      },
    },
    {
      $unwind: '$email',
    },
    {
      $unwind: {
        path: '$userDetails', // Flatten the array to get user details for each request
        preserveNullAndEmptyArrays: true, // In case there are requests with no matching user
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%m-%d', date: '$requestDate' } },
        requests: { $push: '$$ROOT' },
      },
    },
  ]);

  const val = [];
  let startPoint = '';
  let endPoint = '';
  let lastIndex = 0;
  for (const i in dateRange) {
    let existingRequests = null;
    for (const j in request) {
      if (dateRange[i] == request[j]._id) {
        existingRequests = request[j];
      }
    }
    if (existingRequests) {
      lastIndex = Number(i);
      val.push({ _id: `${startPoint} ${endPoint && `- ${endPoint}`}`, request: null });
      val.push(existingRequests);
      startPoint = '';
      endPoint = '';
    } else if (startPoint) {
      endPoint = dateRange[i];
    } else {
      startPoint = dateRange[i];
    }
    if (dateRange.length - 1 == Number(i)) {
      val.push({ _id: `${(lastIndex + 1 < Number(i) && dateRange[lastIndex + 1] + ' - ') || ''}${dateRange[i]}`, request: null });
    }
  }

  return val;
};
