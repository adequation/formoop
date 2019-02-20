import * as Firebase from 'firebase'
import {getClosedFormFromID, getPublishedFormFromID} from "../helpers/firebaseHelpers";

export const closePublishedForm = (formID) => {
  Firebase.database().ref(getPublishedFormFromID(formID))
    .once('value', function (snapshot){
      Firebase.database().ref(getClosedFormFromID(formID))
        .set(snapshot.val())
      Firebase.database().ref(getPublishedFormFromID(formID)).remove();
    })
};
