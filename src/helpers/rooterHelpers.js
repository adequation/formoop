export function getFormURL(formID, window){
  return window.location.origin + '#/answer/' + formID;
}

export function getFormUrlWithUserID(formID, userID, window){
  return window.location.origin + '#/answer/' + formID + '/' + userID;
}

export function getHomeURL(window){
  return window.location.origin + '#/home';
}
