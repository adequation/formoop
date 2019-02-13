import {handleError,} from "@/helpers/loginErrorHandlingHelpers";

const loginErrors = [
  {code : 'auth/invalid-email'},
  {code : 'auth/email-already-in-use'},
  {code : 'auth/weak-password'},
  {code : 'auth/user-not-found'},
  {code : 'auth/wrong-password'}
];

describe('loginErrorHandlingHelpers.js', () => {

  it('Should respond to all the error cases', () => {
    expect(loginErrors.every((e) => !!handleError(e))).toEqual(true);
  });

  it('Should not respond to a unknown error case', () => {
    const unknownError = {code : "unknown error"};

    expect(!!handleError(unknownError)).toEqual(false);

  });

});
