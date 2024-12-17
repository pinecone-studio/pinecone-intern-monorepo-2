import { Request } from "src/models";

export const totalHours = (list: Request[]) => {
  let totalHours = 0;

  for (let i = 0; i < list.length; i++) {
    const { startTime, endTime } = list[i];

    if (startTime && endTime) {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const hourDifference = endHour - startHour + (endMinute - startMinute) / 60;
      totalHours += hourDifference;
    } else {
      totalHours += 8;
    }
  }

  return totalHours;

};
