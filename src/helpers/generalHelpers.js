export function clipText(text, size, dots = false) {
  if (!text) return '';

  if (text.length <= size) return text;

  if (!dots)
    return text.substring(0, size);

  return text.substring(0, Math.max(size - 3, 0)).concat('...');
}

//we update the usersAnswers of the currentForm
//if an entry has deeply changed, we wipe it's answers
//we consider that an entry has deeply changed if the answer type has changed
export function updateAnswers(newForm, currentForm) {
  if (!currentForm.usersAnswers) return {}; //there were no answers

  let newUsersAnswers = {};

  //we doen't keep answers were we shouldn't
  Object.keys(newForm.entries).forEach(k => {
    const nfe = newForm.entries[k];
    const currentEntry = currentForm.entries[k];
    if (!currentEntry) return; //it's a new entry, so there isn't any answers yet

    //the entry has deeply changed, we wipe it's answers
    if (nfe.answer.type !== currentEntry.answer.type) return;

    //if title changed, discard answers ?
    //if(nfe.question.title !== currentEntry.question.title) return;

    //we can now merge with what we can keep
    const currentEntryUsersAnswers = currentForm.usersAnswers[k];
    if (!currentEntryUsersAnswers) return; // there wasn't any answers

    //keeping only answers to options that still exists
    //so we go through every answers of the entry

    newUsersAnswers = {...filterEntryAnswers(currentEntryUsersAnswers, nfe, newUsersAnswers, currentEntry)}

  });

  //we trimmed what wasn't needed anymore !
  return newUsersAnswers;
}

//we go through every user answer of an entry
//and check wether we keep it or not
export function filterEntryAnswers(currentEntryUsersAnswers, newFormEntry, newUsersAnswers, currentEntry) {

  //we work on every user and answer for a given entry
  Object.keys(currentEntryUsersAnswers).forEach(userID => {
    const userAnswer = currentEntryUsersAnswers[userID];

    const currentAnswer = currentEntry.answer.answers.find(cfa => cfa.id === userAnswer);

    //we filter answers of options that changed
    //if it isn't an array (text, textarea, radio or select)
    if (!Array.isArray(userAnswer)) {

      const fullAnswer = newFormEntry.answer.answers.find(nfa => nfa.id === userAnswer);
      if(!fullAnswer) return; //option doesn't exists anymore, bye

      if (fullAnswer.text === currentAnswer.text) { //option didn't change, else we discard it

        if (!newUsersAnswers[newFormEntry.id]) newUsersAnswers[newFormEntry.id] = {};

        newUsersAnswers[newFormEntry.id][userID] = userAnswer;
      }

    }
    else {//if it's a check box answer

      //if one of the answer isn't right, we discard all the answer
      if (userAnswer.every(ua => {
        //we want the full new option
        const fullUa = newFormEntry.answer.answers.find(a => a.id === ua);
        if (!fullUa) return; //option doesn't exists anymore, bye

        //we want the full current option
        const fullCua = currentEntry.answer.answers.find(a => a.id === ua);

        return fullUa.text === fullCua.text //option didn't change
      })) {
        if (!newUsersAnswers[newFormEntry.id]) newUsersAnswers[newFormEntry.id] = {};

        newUsersAnswers[newFormEntry.id][userID] = userAnswer;
      }

    }
  });

  return newUsersAnswers;
}

//we want to keep answers, invited people and entry points
export function updatePublishedForm(newForm, currentForm) {

  //we copy entry points and users
  newForm.users = currentForm.users || {};
  newForm.entryPoint = currentForm.entryPoint || {};

  //we update users' answers
  newForm.usersAnswers = updateAnswers(newForm, currentForm);

  return newForm;
}


