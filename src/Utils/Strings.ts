import moment from "moment";
import { useAuth } from "../Hooks/useAuth";
import { useEffect } from "react";

// function getAllMonthsForCurrentYear() {
//   const currentYear = moment().year();
//   const months = [];

//   for (let month = 0; month < 12; month++) {
//     const date = moment({ year: currentYear, month: month, day: 1 });
//     months.push(date.format("MMM-YY"));
//   }

//   return months;
// }

export function roundUp(value: any | string, decimals: number): number {
  if (value === undefined || value === 0.00 || value === null || value === "null" || value === "") {
    return 0.00;
}
  const val = +value;
  const multiplier = Math.pow(10, decimals);
  const shiftedNumber = val * multiplier;

  // Check if the fractional part is less than or equal to 0.5 minus a small epsilon to handle precision issues
  if (shiftedNumber - Math.floor(shiftedNumber) <= 0.5 - 0.00000000000001) {
    return Math.floor(shiftedNumber) / multiplier;
  } else {
    return Math.ceil(shiftedNumber) / multiplier;
  }
}

export function formatNumberUS(numberStr: string | number): string {
  
  if (typeof numberStr === 'number') {
      numberStr = numberStr.toString();
  }

  if (numberStr === undefined || numberStr === null || numberStr === "null" || numberStr === "") {
      return "0.00";
  }

  if (isNaN(Number(numberStr))) {
    return numberStr;
  }

  if (numberStr.split(".").length > 2) {
      return "";
  }

  let [integerPart, decimalPart] = numberStr.split(".");

  integerPart = integerPart.replace(/^0+(?=\d)/, "");

  let formattedInt = integerPart
  .split("")                         
  .map((char, index, arr) => {
      let posFromLeft = arr.length - index;
      if(posFromLeft == arr.length){
        return char;
      }
      else if (posFromLeft > 1 && posFromLeft % 3 === 0) {
          return `,${char}`;        
      } else {
          return char;
      }
  })
  .join("");   
  let formattedNumber = decimalPart ? `${formattedInt}.${decimalPart.length === 1 ?`${decimalPart}0`:decimalPart?.substring(0,2)}` : `${formattedInt}.00`;
  return formattedNumber;
}


const user = JSON.parse(localStorage.getItem("user") || "{}");
// function getAllMonthsForCurrentYear(startingMonth: string) {
//   const currentYear = moment().year();
//   const months = [];
//   const startMonthIndex = moment().month(startingMonth).month();

//   for (let month = startMonthIndex; month < 12; month++) {
//     const date = moment({ year: currentYear, month: month });
//     months.push(date.format("MMM-YY"));
//   }

//   for (let month = 0; month < startMonthIndex; month++) {
//     const date = moment({ year: currentYear + 1, month: month });
//     months.push(date.format("MMM-YY"));
//   }
// export const monthsForCurrentYear = getAllMonthsForCurrentYear(
//   moment(user.financial_year, "YYYY-MM-DD").format("MMM")
// );

//   return months;
// }

// export const monthsForCurrentYear = getAllMonthsForCurrentYear(
//   moment(user?.financial_year, "YYYY-MM-DD").format("MMM")
// );
// console.log(monthsForCurrentYear + "monthMapping");

// export const monthMapping: { [key in string]: string } =
//   monthsForCurrentYear.reduce((acc, month, index) => {
//     const monthKey = `M${index + 1}`;
//     acc[monthKey] = month;
//     return acc;
//   }, {} as { [key in string]: string });

// console.log(JSON.stringify(monthMapping) + "monthMapping");
export const currentDate = new Date().toJSON().slice(0, 10);

export const FYear = `${moment(currentDate, "YYYY-MM-DD").format(
  "YYYY"
)}-${moment(currentDate, "YYYY-MM-DD").add(1, "y").format("YY")}`;

export const CurrentFyYear = `${moment(
  user?.financial_year,
  "YYYY-MM-DD"
).format("YYYY")}`;

// export const monthMapping: { [key in string]: string } = {
//   M1: "Jan-24",
//   M2: "Feb-24",
//   M3: "Mar-24",
//   M4: "Apr-24",
//   M5: "May-24",
//   M6: "Jun-24",
//   M7: "Jul-24",
//   M8: "Aug-24",
//   M9: "Sep-24",
//   M10: "Oct-24",
//   M11: "Nov-24",
//   M12: "Dec-24",
// };

export const EnergySource = {};

export const strings = {
  contributor: "CONTRIBUTOR",
  sessionExpiredMsg:
    "Your ession has expired. Login back to manage your account!",
  sessionExpireMsg:
    "Your session has expired. Please login back to manage your account.",
  sessionExpiringSoon: "Session Expiring Soon",
  sessionExpired: "Session Expired",
  sessionWillExpire:
    "For the safety of your privacy, your session will expire in",
  someThingWentWrong: "Something went wrong!!",
  sessionSignOut: "Signout",
  sessionSignIn: "Stay Signed In",
  sessionExpire: "Your session is about to expire!",
  sessionInactive:
    "You have been inactive for a while. for the safety of your privacy, your session will expire in ",
  sessionMinutes: "Minutes.",
  noData: "No data",
  ok: "Okay",
  na: "N/A",
  note: "Note!",
  note1:
    "By changing the current preferred currency, it may reflects to all users.",
  note2: "If you change currency it will take around ",
  noteTime: "30 minutes ",
  note3: "to reflect.",
};

export const environmentConfig = [
  "301 Materials 2016",
  "302 Energy 2016",
  "303 Water and Effluents 2018",
  "305 Emissions 2016",
  "306 Waste 2020",
  "308 Supplier Environmental Assessment 2016",
];

export const socialConfig = [
  "401 Employment 2016",
  "403 Occupational Health and Safety 2018",
  "404 Training and Education 2016",
  "405 Diversity and Equal Opportunity 2016",
  "414 Supplier Social Assessment 2016",
  "416 Customer Health and Safety 2016",
];

export const goveranceConfig = [
  "201 Economic Performance 2016",
  "202 Market Presence 2016",
  "203 Indirect Economic Impacts 2016",
  "205 Anti-corruption 2016",
  "206 Anti-competitive Behavior 2016",
  "207 Tax 2019",
];
