import * as Firebase from 'firebase'
import {getEntryAnsweringPath, getPublishedFormFromID} from "@/helpers/firebaseHelpers";

export const setSelectedAnswersFB = (formID, answers, userID) => {
    Object.keys(answers).forEach(entryID => {
      const userAnswer = answers[entryID];

      return Firebase.database().ref(getEntryAnsweringPath(formID, entryID, userID)).set(userAnswer);
    })
};

export const setSelectedAnswerFB = (formID, entryID, answers, userID) => {
  const userAnswer = answers[entryID];

  return Firebase.database().ref(getEntryAnsweringPath(formID, entryID, userID)).set(userAnswer);
};

export const deleteUserAnswerFB = (formID, entryID, userID) => {
  Firebase.database().ref(getEntryAnsweringPath(formID, entryID, userID))
    .remove().then( (e) => {})
    .catch((e) => {
      console.error(e)
  })
};
