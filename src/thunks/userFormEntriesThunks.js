import * as Firebase from 'firebase'
import {getCreatedFormFromID, getPublishedFormFromID} from "@/helpers/firebaseHelpers";

export const setSelectedAnswersFB = (formID, answers, userID) => {
  Object.keys(answers).forEach(aKey => {
    const answer = answers[aKey];
    Firebase.database().ref(getPublishedFormFromID(formID).concat('/entries/').concat(aKey)
      .concat('/usersAnswers/'.concat(userID)))
      .set(answers).then((e) => {

    }).catch((e) => {
      console.error(e)
    })
  })
};
