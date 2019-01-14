import * as Firebase from 'firebase'
import {setFormsCampaignFB} from "./creatorForm";

export function updateUserProfile( user, data){
  return user.updateProfile(data);
}

export function updateUserProfileDisplayName(user, firstName, lastName){
  const displayName = firstName.concat(' ' + lastName);
  return updateUserProfile(user, {displayName});
}

export const updateUserProfileData = (user, userData) => {
  Object.keys(userData).forEach(userDataKey => {
    Firebase.database().ref('/users/'.concat(user.uid).concat('/data/').concat(userDataKey))
      .set(userData[userDataKey])
  })
};

export function getUserData(user){
  let data;
  return Firebase.database().ref('/users/'.concat(user.uid).concat('/data'))
    .once('value', function (snapshot) {
      return snapshot.val()
    })
}
