function countDays(sinceDate) {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const currentDate = new Date("2023-01-03");
  const daysSince = Math.round(Math.abs((currentDate - sinceDate) / oneDay));
  return daysSince;
}

function weekCount(sinceDate) {
  return Math.floor(countDays(sinceDate) / 7) + 1;
}

module.exports = weekCount;
