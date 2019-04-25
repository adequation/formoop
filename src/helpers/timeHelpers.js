export function today(){
  return new Date()
}

export function getFormattedToday(){
  return today().toLocaleString(undefined, {weekday: "long", month: "long", day: "numeric"})
}

export function getFormattedHourMinutes(){
  return today().toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Paris"
  })
}
