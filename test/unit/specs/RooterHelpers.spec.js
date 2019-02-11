import {getFormURL, getFormUrlWithUserID, getHomeURL} from "@/helpers/rooterHelpers";

const mockedForm   = 'form';
const mockedUser = 'user';
const mockedWindow = {location: {origin: 'mockedOrigin'}};

describe('rooterHelpers.js', () => {

  it('Should get the correct form URL', () => {
    expect(getFormURL(mockedForm, mockedWindow)).toEqual('mockedOrigin#/answer/' + mockedForm);
  });

  it('Should get the correct form URL', () => {
    expect(getFormUrlWithUserID(mockedForm, mockedUser, mockedWindow))
      .toEqual('mockedOrigin#/answer/' + mockedForm + '/' + mockedUser);
  });

  it('Should get the correct form URL', () => {
    expect(getHomeURL(mockedWindow)).toEqual('mockedOrigin#/home');
  });

});
