// source: https://stackoverflow.com/a/6313008
export const secondsToHHMMSS = (totalSeconds: number) => {
  const sec_num = totalSeconds;
  let hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
  let seconds: number | string = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

export const easyEpochDate = (year: number, month = 1, day = 1) =>
  new Date(`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T00:00:00`).getTime();

export const msToDays = (ms: bigint) => (ms ? parseFloat(ms / (1000n * 60n * 60n * 24n)) : 0);

export const monthNames =  new Array(12).fill(0).map((_, i) => {
  return new Date(`${i + 1}/1/2005`).toLocaleDateString(undefined, {month: 'long'})
})

export const daysInMonth = (month:number, year: number) => {
  return new Date(year, month, 0).getDate();
};
