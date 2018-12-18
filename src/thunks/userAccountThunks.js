

export function updateUserProfile( user, data){
  return user.updateProfile(data);
}

export function updateUserProfileDisplayName(user, firstName, lastName){
  const displayName = firstName.concat(' ' + lastName);
  return updateUserProfile(user, {displayName});
}
