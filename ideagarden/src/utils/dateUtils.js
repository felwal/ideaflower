export function formatDate(epoch) {
  const ideaDate = new Date(epoch);
  const now = new Date();
  let dateString = "";

   if (ideaDate.getDate() === now.getDate()
     && ideaDate.getMonth() === now.getMonth()
     && ideaDate.getFullYear() === now.getFullYear()) {

    const options = {hour: "numeric", minute: "numeric", hour12: false};
    dateString = ideaDate.toLocaleTimeString(undefined, options);
  }
  else {
    const options = {day: "numeric", month: "short"};
    if (ideaDate.getFullYear() !== now.getFullYear()) options.year = "numeric";

    dateString = ideaDate.toLocaleDateString(undefined, options);
  }

  return dateString;
}

export function formatDuration(epoch1, epoch2) {
  const epochPlantedToGrown = Math.abs(epoch2 - epoch1);
  const daysPlantedToGrown = epochPlantedToGrown / 86_400_000;
  const hoursPlantedToGrown = (daysPlantedToGrown % 1) * 24;
  const minutesPlantedToGrown = (hoursPlantedToGrown % 1) * 60;
  const secondsPlantedToGrown = (minutesPlantedToGrown % 1) * 60;
  let timePlantedToGrown = "";

  if (daysPlantedToGrown >= 1) timePlantedToGrown = Math.round(daysPlantedToGrown) + "d"
  else if (hoursPlantedToGrown >= 1) timePlantedToGrown = Math.round(hoursPlantedToGrown) + "h"
  else if (minutesPlantedToGrown >= 1) timePlantedToGrown = Math.round(minutesPlantedToGrown) + "m"
  else timePlantedToGrown = Math.round(secondsPlantedToGrown) + "s"

  return timePlantedToGrown;
}
