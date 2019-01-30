import * as Firebase from 'firebase'
import {getUser} from "@/helpers/firebaseHelpers";

export function updateUserProfile( user, data){
  return user.updateProfile(data);
}

export function updateUserProfileDisplayName(user, firstName, lastName){
  const displayName = firstName.concat(' ' + lastName);
  return updateUserProfile(user, {displayName});
}

export const updateUserProfileMetadata = (user, userData) => {
    return Firebase.database().ref(getUser(user.uid).concat('/metadata/'))
      .set(userData)
};

  export function getUserMetadata(userID){
  return Firebase.database().ref(getUser(userID).concat('/metadata'))
    .once('value', function (snapshot) {
      return snapshot.val()
    })
}
