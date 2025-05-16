// utils/leaveAccrual.js
const {
  addMonths,
  lastDayOfMonth,
  isBefore,
  differenceInMonths,
} = require("date-fns");
const { zonedTimeToUtc, utcToZonedTime } = require("date-fns-tz");

const PH_TIMEZONE = "Asia/Manila";

const getTodayPHT = () => {
  const now = new Date();
  return utcToZonedTime(now, PH_TIMEZONE);
};

const convertToPHTime = (date) => {
  return utcToZonedTime(date, PH_TIMEZONE);
};

// Helper to get the same day next month (adjusts for short months)
const getSameDayNextMonth = (date) => {
  const originalDay = date.getDate();
  let nextMonth = addMonths(date, 1);

  // If the next month doesn't have this day (e.g., Jan 31 → Feb 28/29)
  if (nextMonth.getDate() !== originalDay) {
    nextMonth = lastDayOfMonth(nextMonth); // Adjust to last day
  }

  return nextMonth;
};

const calculateAccrual = (employee) => {
  const todayPHT = getTodayPHT();
  todayPHT.setHours(0, 0, 0, 0); // Start of day in PHT

  // Convert stored dates to PHT for comparison
  const nextAccrualPHT = convertToPHTime(employee.nextAccrualDate);
  nextAccrualPHT.setHours(0, 0, 0, 0);

  // Check if it's time to accrue leave (in PHT)
  if (isBefore(todayPHT, nextAccrualPHT)) {
    return null; // Not time yet
  }

  const lastAccrualPHT = convertToPHTime(employee.lastAccrualDate);
  lastAccrualPHT.setHours(0, 0, 0, 0);

  // Calculate how many full months have passed
  const monthsPassed = differenceInMonths(todayPHT, lastAccrualPHT);

  if (monthsPassed < 1) {
    return null;
  }

  // Calculate new values in PHT
  const accruedDays = employee.accrualRate * monthsPassed;
  const newBalance = employee.currentBalance + accruedDays;

  // Calculate new accrual dates
  let newLastAccrualPHT = lastAccrualPHT;
  for (let i = 0; i < monthsPassed; i++) {
    newLastAccrualPHT = getSameDayNextMonth(newLastAccrualPHT);
  }
  const newNextAccrualPHT = getSameDayNextMonth(newLastAccrualPHT);

  // Convert back to UTC for storage
  return {
    currentBalance: newBalance,
    lastAccrualDate: zonedTimeToUtc(newLastAccrualPHT, PH_TIMEZONE),
    nextAccrualDate: zonedTimeToUtc(newNextAccrualPHT, PH_TIMEZONE),
    accruedDays,
    months: monthsPassed,
    historyEntry: {
      date: new Date(),
      action: "monthly accrual",
      amount: accruedDays,
      description: `Accrued ${accruedDays} days for ${monthsPassed} month(s)`,
    },
  };
};

module.exports = {
  calculateAccrual,
  getTodayPHT,
  convertToPHTime,
  getSameDayNextMonth,
};
