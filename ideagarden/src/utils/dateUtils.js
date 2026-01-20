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
