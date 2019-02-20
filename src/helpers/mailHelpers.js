import {getFormURL, getFormUrlWithToken, getFormUrlWithUserID} from "@/helpers/rooterHelpers";
import {generateEmailToken, getUserIdFromEmail} from "@/helpers/accountHelpers";

export function sendMailWithSocket(socket, mail) {
  socket.emit('sendMail', mail);
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
  return 'Vous avez été invité par '
    .concat('<strong>' + userDisplayName + '</strong> ')
    .concat('à participer et à animer le formulaire \n')
    .concat('<strong>' + formName + '</strong>.')
    .concat('En tant qu\'animateur, vous aurez la responsabilité d\'inviter vos colègues au sondage mais aussi de clore celui-ci une fois terminé')
    .concat('rejoignez ici : ')
    .concat(formURL);
}
