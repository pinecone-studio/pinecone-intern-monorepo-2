import { Request } from "src/models";

export const totalHours = (list: Request[]) => {
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
  