import * as Firebase from 'firebase'
import {getInvitationsPath, getEntryPointPath} from "@/helpers/firebaseHelpers";

export function saveFormInvitationsFB(formID, mails){
  return Firebase.database().ref(getInvitationsPath(formID))
    .set(mails);
}

export function saveFormEntryPointFB(formID, mails){
  return Firebase.database().ref(getEntryPointPath(formID))
    .set(mails);
}
