export function today(){
  return new Date();
}

export function getFormattedHourMinutes(){
  return today().toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Paris"
  })
}
