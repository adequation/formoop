import * as Firebase from 'firebase'
import {getCreatedFormFromID, getPublishedFormFromID} from "@/helpers/firebaseHelpers";


export const setSelectedAnswersFB = (formPath, answers, userID) => {
  Object.keys(answers).forEach(aKey => {
    Firebase.database().ref(formPath.concat('/entries/').concat(aKey)
      .concat('/usersAnswers/'.concat(userID)))
      .set(answers).then((e) => {

    }).catch((e) => {
      console.error(e)
    })
  })
};

export const deleteUserAnswerFB = (formPath, entryID, userID) => {
  Firebase.database().ref(formPath.concat('/entries/').concat(entryID)
    .concat('/usersAnswers/').concat(userID))
    .remove().then( (e) => {})
    .catch((e) => {
      console.error(e)
  })
};
