import {getFormUrlWithInvite, getInvitationText, sendMailWithSocket} from "@/helpers/mailHelpers";
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

});
