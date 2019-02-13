export function isAnswered(formEntry, userAnswers){
  return userAnswers ? !!userAnswers[formEntry.id] : false;
}

export function filterEntries(filterType, formEntries, userAnswers) {
  switch (filterType) {
    case "answered":
      return formEntries.filter(e => isAnswered(e, userAnswers));
    case "notAnswered":
      return formEntries.filter(e => !isAnswered(e, userAnswers));
    default:
      return formEntries;
  }
}

export let getRawPercentage = (filterType, formEntries, userAnswers) => {
  return (filterEntries(filterType, formEntries, userAnswers).length / formEntries.length);
};

export function getPercentage(filterType, formEntries, userAnswers){
  return getRawPercentage(filterType, formEntries, userAnswers) * 100;
}
