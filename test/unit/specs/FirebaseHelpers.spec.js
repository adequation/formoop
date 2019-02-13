import {
  getAnsweringPath,
  getCreatedFormFromID,
  getCreatedForms, getEntryAnsweringPath,
  getPublishedFormFromID, getPublishedFormUserPath, getPublishedFormUsersPath,
  getUser,
  publishingPath,
  userPath
} from "@/helpers/firebaseHelpers";

describe('firebaseHelpers.js', () => {
  it('Should give the user path', () => {
    const mockUser  = 'mock';
    const expected  = userPath.concat(mockUser);

    expect(getUser(mockUser)).toEqual(expected);
  });

  it('Should give the correct created form path', () => {
    const mockedID  = 'formID';
    const mockUser  = 'mock';
    const expected  = '/users/'.concat(mockUser)
      .concat("/createdForms/").concat(mockedID);

    expect(getCreatedFormFromID(mockUser, mockedID)).toEqual(expected);
  });

  it('Should give the correct created forms path', () => {
    const mockUser  = 'mock';
    const expected  = '/users/'.concat(mockUser).concat("/createdForms");

    expect(getCreatedForms(mockUser)).toEqual(expected);
  });

  it('Should give the correct published forms path', () => {
    const mockedID  = 'formID';
    const expected  = publishingPath.concat(mockedID);

    expect(getPublishedFormFromID(mockedID)).toEqual(expected);
  });

  it('Should give the correct published user forms path', () => {
    const mockUser  = 'mock';
    const mockedID  = 'formID';

    const expected  = getPublishedFormFromID(mockedID).concat(getUser(mockUser));

    expect(getPublishedFormUserPath(mockedID, mockUser)).toEqual(expected);
  });

  it('Should give the correct users from a published form path', () => {
    const mockedID  = 'formID';

    const expected  = getPublishedFormFromID(mockedID).concat(userPath);

    expect(getPublishedFormUsersPath(mockedID)).toEqual(expected);
  });

  it('Should give the correct answers from a published form path', () => {
    const mockedID  = 'formID';

    const expected  = getPublishedFormFromID(mockedID).concat('/usersAnswers/');

    expect(getAnsweringPath(mockedID)).toEqual(expected);
  });

  it('Should give the correct answers from a published form path', () => {
    const mockedFromID  = 'formID';
    const mockedEntryID  = 'entryID';
    const mockedUserID  = 'userID';

    const expected  = getAnsweringPath(mockedFromID).concat(mockedEntryID).concat('/').concat(mockedUserID);

    expect(getEntryAnsweringPath(mockedFromID, mockedEntryID, mockedUserID)).toEqual(expected);
  });

});
