import moment from "moment";
import momentTimezone from "moment-timezone";
momentTimezone.tz.setDefault(`UTC`);

//IMPORTANT - BE SURE TO USE .clone() WHEN ALTERING

//WEEK TO SCHEDULE (EX. 21)
export const schedulingWeek = moment().add(2, "w").startOf("w");
//THIS COMING WEEK (SHOULD ALREADY BE SCHEDULED EX. 14)
export const comingWeek = moment().add(1, "w").startOf("w");
//SCHEDULING START DAY (EX. 15 A MONDAY)
export const startSchedule = moment().add(2, "w").isoWeekday(1);
