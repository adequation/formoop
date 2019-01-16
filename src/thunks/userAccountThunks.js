import * as Firebase from 'firebase'
import {getUser} from "@/helpers/firebaseHelpers";

export function updateUserProfile( user, data){
  return user.updateProfile(data);
}

export function updateUserProfileDisplayName(user, firstName, lastName){
  const displayName = firstName.concat(' ' + lastName);
  return updateUserProfile(user, {displayName});
}

export const updateUserProfileMetaData = (user, userData) => {
    return Firebase.database().ref(getUser(user.uid).concat('/metaData/'))
      .set(userData)
};

export function getUserMetaData(user){
  return Firebase.database().ref(getUser(user.uid).concat('/metaData'))
    .once('value', function (snapshot) {
      return snapshot.val()
    })
}
