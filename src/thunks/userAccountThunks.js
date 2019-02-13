import * as Firebase from 'firebase'
import {getPublishedFormFromID, getPublishedFormUserPath, getPublishedFormEntryPointPath, getUser} from "@/helpers/firebaseHelpers";

export function updateUserProfile(user, data) {
  return user.updateProfile(data);
}

export function updateUserProfileDisplayName(user, firstName, lastName) {
  const displayName = firstName.concat(' ' + lastName);
  return updateUserProfile(user, {displayName});
}

export function updateUserProfileMetadata(user, userData) {
  return Firebase.database().ref(getUser(user.uid).concat('/metadata/'))
    .set(userData)
}

export function getUserMetadata(userID) {
  return Firebase.database().ref(getUser(userID).concat('/metadata'))
    .once('value', function (snapshot) {
      return snapshot.val()
    })
}

export function inviteUser(userID, formID, metadata) {
  const ref =  Firebase.database().ref(getPublishedFormUserPath(formID, userID));
  return ref.once('value', (snapshot) => {
    if( snapshot.val() === null ) {
      ref.set( metadata );
    }
  });
}

export function inviteEntryPoint(userID, formID, metadata){
  const ref = Firebase.database().ref(getPublishedFormEntryPointPath(formID, userID));
  return ref.once('value', (snapshot) => {
    if( snapshot.val() === null){
      ref.set(metadata);
    }
  })
}
