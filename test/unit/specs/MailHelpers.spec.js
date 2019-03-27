import {
  getFormUrlWithInvite,
  getInvitationEntryPointText,
  getInvitationText,
  isValidAddress,
  sendMailWithSocket
} from "@/helpers/mailHelpers";
import {getFormUrlWithUserID} from "@/helpers/rooterHelpers";
import {getUserIdFromEmail} from "@/helpers/accountHelpers";

describe('genericQuestionTitle.js', () => {

  it('Should get the email body from form name and user name', () => {

    const mockedForm = 'form';
    const mockedUser = 'user';

    const expected = 'Vous avez été invité par '
      .concat('<strong>' + mockedForm + '</strong> ')
      .concat('à participer au formulaire ')
      .concat('<strong>' + mockedUser + '</strong> ');

    expect(getInvitationText(mockedUser, mockedForm)).toEqual(expected);
  });

  it('Should get the correct form URL', () => {

    const mockedForm   = 'form';
    const mockedAddres = 'user@user.com';
    const mockedWindow = {location: {origin: 'mockedOrigin'}};

    const expected = getFormUrlWithUserID(mockedForm,
      getUserIdFromEmail(mockedAddres),
      mockedWindow
    );

    expect(getFormUrlWithInvite(mockedAddres, mockedForm, mockedWindow)).toEqual(expected);
  });

  it('Should be valid adresses', () => {
    const mockedAddress1 = 'mock@mock.mock';
    const mockedAddress2 = 'mock@mock.mock.mock';

    expect(isValidAddress(mockedAddress1)).toEqual(true);
    expect(isValidAddress(mockedAddress2)).toEqual(true);
  });

  it('Should be unvalid adresses', () => {
    const mockedAddress1 = 'mockmock.mock';
    const mockedAddress2 = 'mock@mock';
    const mockedAddress3 = 'mock';

    expect(isValidAddress(mockedAddress1)).toEqual(false);
    expect(isValidAddress(mockedAddress2)).toEqual(false);
    expect(isValidAddress(mockedAddress3)).toEqual(false);
  });

  it('Should get the correct email body', ()=> {
    const mockedForm = 'form';

    const expected = 'Vous avez été invité '
      .concat('à participer et à animer le formulaire \n ')
      .concat('<strong>' + mockedForm + '</strong>. </br>')
      .concat('En tant qu\'animateur, vous aurez la responsabilité d\'inviter vos colègues au sondage mais aussi de clore celui-ci une fois terminé. \n');

    expect(getInvitationEntryPointText(mockedForm)).toEqual(expected);
  })

});
