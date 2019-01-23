import * as Firebase from 'firebase'
import {getInvitationsPath} from "@/helpers/firebaseHelpers";

export function saveFormInvitationsFB(formID, mails){
  return Firebase.database().ref(getInvitationsPath(formID))
    .set(mails);
}
