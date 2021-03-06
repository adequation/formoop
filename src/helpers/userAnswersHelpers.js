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

//return the answer of a single entry
export function getEntryAnswers(entryID, userAnswers){
  return userAnswers[entryID] ? userAnswers[entryID] : {};
}

//check if 2 answers are the same
export function sameAnswers(a, b) {
  if(Array.isArray(a) && Array.isArray(b)) return sameAnswersArray(a,b);

  if(typeof a !== typeof b) return false;

  return a === b;
}

//check if 2 answer array are the same
export function sameAnswersArray(a,b) {
  if(a.length !== b.length) return false;

  return a.every(answer => b.includes(answer));
}

//Check if an entry is in conflict
export function isEntryInConflict(entryID, userAnswers){
  const entryAnswers = getEntryAnswers(entryID, userAnswers);

  const answersArray = Object.keys(entryAnswers).map(userID => entryAnswers[userID]);

  //checking one user is enough
  const firstAnswer = answersArray[0];
  return !answersArray.every(a => sameAnswers(a, firstAnswer));
}

//return the ID of all the entries in conflict
export function conflictedEntries(userAnswers){
  return Object.keys(userAnswers).filter(entryID => isEntryInConflict(entryID, userAnswers));
}

//return the sorted number of user answers as an object
export function answerAmount(entry, userAnswers){
  const optionArray = entry.answer.answers;
  const answers = {};
  optionArray.forEach(option => answers[option.id] = 0);

  const entryAnswers = getEntryAnswers(entry.id, userAnswers);

  Object.keys(entryAnswers).forEach(userID => {
    const userAnswer = entryAnswers[userID];

    if(Array.isArray(userAnswer)) userAnswer.forEach(a => answers[a] += 1);
    else answers[userAnswer] += 1;
  });

  return answers;
}

//return an array of entry's answer repartition
export function answerArray(entry, userAnswers) {
  const number = answerAmount(entry, userAnswers);
  return Object.keys(number).map(optionID => number[optionID]);
}

//return the answers, split into a "group"
export function userAnswerGroup(entryID, userAnswers){
  const entryAnswers = getEntryAnswers(entryID, userAnswers);

  const group = {};

  Object.keys(entryAnswers).forEach(userID => {
    const userAnswer = entryAnswers[userID];

    if(Array.isArray(userAnswer)) userAnswer.forEach(a => {
      group[a] ? group[a].push(userID) : group[a] = [userID];
    });

    else group[userAnswer] ? group[userAnswer].push(userID) : group[userAnswer] = [userID];
  });

  return group;
}

//return a percentage of the answers' "homogeneity"
export function cohesion(answers){
  if (answers.every(a => a === 0)) return undefined;

  const sum = answers.reduce((a, b) => a + b, 0);
  const means = answers.map(e => e / sum);
  const max = means.reduce((a, b) => (a > b ? a : b), 0);

  return (
    means.map(m => max - m).reduce((a, b) => a + b, 0) /
    (max * (means.length - 1))
  );
}

//return the number of active participant
export function activeParticipantNumber(userAnswers){
  //if there is no one, or no one has answered, return it
  if(!userAnswers) return 0;

  const activePeople = {};

  Object.keys(userAnswers).forEach(entryID => {
    const usersThatAnswered = userAnswers[entryID];
    Object.keys(usersThatAnswered).map(userID => activePeople[userID] = true)
  });

  return Object.keys(activePeople).length;
}

//return a the list of entries answered by a user
export function answeredEntries(userID, userAnswers) {
  return Object.keys(userAnswers).filter(key => Object.keys(userAnswers[key]).includes(userID));
}

export function areAnswersUpdated(userAnswers, selectedAnswers, formEntries, userID){
  return formEntries.some(fe => {
    const userEntryAnswers = userAnswers[fe.id] ? userAnswers[fe.id][userID] : null;
    const selectedEntryAnswers = selectedAnswers[fe.id];
    if(isEntryUpdated(userEntryAnswers, selectedEntryAnswers)) return true
  });
}

export function isEntryUpdated(userEntryAnswers, selectedEntryAnswers){
  const userA = userEntryAnswers || null;

  if(selectedEntryAnswers === undefined) return false;

  if(Array.isArray(selectedEntryAnswers)){
    if(!Array.isArray(userA)) return selectedEntryAnswers.length > 0;
    return userA.length !== selectedEntryAnswers.length
      || !selectedEntryAnswers.every(a => userA.includes(a));
  }
  return userA !== selectedEntryAnswers;
}
