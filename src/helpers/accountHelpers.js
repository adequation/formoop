
//Generate a base64 token from an email adress
export function generateEmailToken(emailAdress) {
  return window.btoa(unescape(encodeURIComponent( emailAdress )));
}

//Decode a base64 token from an email adress
export function decodeEmailToken(token){
  return decodeURIComponent(escape(window.atob( token )));
}

export function getUserIdFromEmail(emailAdress){
  return generateEmailToken(emailAdress);
}

export function getNameFromEmail(emailAdress){
  const name   = emailAdress.substring(0, emailAdress.lastIndexOf("@"));
  return name.replace(/\./g, ' ')
}

export function getDomainFromEmail(emailAdress){
  const  domain   = emailAdress.substring(emailAdress.lastIndexOf("@")+1, emailAdress.lastIndexOf('.'));
  return domain.replace(/\./g, ' ')
}

export function getShortName(name){
  const shortName = name.substring(0, name.lastIndexOf(' '));
  return shortName || name;
}
