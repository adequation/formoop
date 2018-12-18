export function sendMailWithSocket(socket, mail){
  socket.emit('sendMail', mail);
}

export function getInvitationText(formName, userDisplayName, formURL){
  return 'Vous avez été invité par '
    .concat('<strong>' + userDisplayName + '</strong> ')
    .concat('à participer au formulaire ')
    .concat('<strong>' + formName + '</strong> ')
    .concat('ici : ')
    .concat(formURL);
}
