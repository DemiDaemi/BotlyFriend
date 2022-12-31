function countDays(sinceDate: any) {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
  const currentDate = new Date() as any;
  const daysSince = Math.round(Math.abs((currentDate - sinceDate) / oneDay));
  return daysSince;
}

function weekCount(sinceDate: any) {
  return Math.floor(countDays(sinceDate) / 7) + 1;
}

module.exports = weekCount;