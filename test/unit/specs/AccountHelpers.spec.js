import {
  decodeEmailToken,
  generateEmailToken,
  getDomainFromEmail,
  getNameFromEmail,
  getUserIdFromEmail
} from "@/helpers/accountHelpers";

describe('accountHelpers.js', () => {
  it('Should encode an adress', () => {
    const mockAdress  = 'mock@mocking.com';
    const expected    = 'bW9ja0Btb2NraW5nLmNvbQ==';

    expect(generateEmailToken(mockAdress)).toEqual(expected);
  });

  it('Should decode an adress', () => {
    const mockToken  = 'bW9ja0Btb2NraW5nLmNvbQ==';
    const expected   = 'mock@mocking.com';

    expect(decodeEmailToken(mockToken)).toEqual(expected);
  });

  it('Should get the name from an email adress', () => {
    const mockAdress  = 'mock@mocking.com';
    const expected   = 'mock';

    expect(getNameFromEmail(mockAdress)).toEqual(expected);
  });

  it('Should get the name from an email adress and splice on the dots', () => {
    const mockAdress  = 'mock.mock.mock-mock@mocking.com';
    const expected   = 'mock mock mock-mock';

    expect(getNameFromEmail(mockAdress)).toEqual(expected);
  });

  it('Should get the domain from an email adress', () => {
    const mockAdress  = 'mock@mocking.com';
    const expected   = 'mocking';

    expect(getDomainFromEmail(mockAdress)).toEqual(expected);
  });

  it('Should get the domain from an email adress and splice on the dots', () => {
    const mockAdress  = 'mock@mock.mock.mock-mock.com';
    const expected   = 'mock mock mock-mock';

    expect(getDomainFromEmail(mockAdress)).toEqual(expected);
  });

  it('Should get the same result as encoding an email adress', () => {
    const mockAdress  = 'mock@mock.mock.mock-mock.com';
    const expected   = generateEmailToken(mockAdress);

    expect(getUserIdFromEmail(mockAdress)).toEqual(expected);
  });
});

