import {getFormURL, getFormUrlWithToken, getFormUrlWithUserID} from "@/helpers/rooterHelpers";
import {generateEmailToken, getUserIdFromEmail} from "@/helpers/accountHelpers";

export function sendMailToBack(mail) {
  return fetch("http://localhost:3000/api/mailer/mail",
    {method:"POST",
      headers: {"Content-Type": "application/json", "Accept":"application/json"},
      body: JSON.stringify(mail)})
}

export function getInvitationText(formName, userDisplayName) {
  return 'Vous avez été invité par '
    .concat('<strong>' + userDisplayName + '</strong> ')
    .concat('à participer au formulaire ')
    .concat('<strong>' + formName + '</strong> ');
}

export function getFormUrlWithInvite(emailAdress, formID, window) {
  return getFormUrlWithUserID(formID, getUserIdFromEmail(emailAdress), window)
}

export function getInvitationEntryPointText(formName, userDisplayName, formURL){
  return 'Vous avez été invité '
    .concat('à participer et à animer le formulaire \n ')
    .concat('<strong>' + formName + '</strong>. </br>')
    .concat('En tant qu\'animateur, vous aurez la responsabilité d\'inviter vos colègues au sondage mais aussi de clore celui-ci une fois terminé. \n');
}

export function isValidAddress(address) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(address);
}

export function isInvitedMailAddress(address, invitedUsers) {
  const usersIDs = Object.keys(invitedUsers);

  const usersArray = usersIDs.map(id => {
    return invitedUsers[id];
  });

  return usersArray.some(user => {
    return user.email === address;
  });
}
