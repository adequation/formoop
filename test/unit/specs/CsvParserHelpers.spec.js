import {cleanWord, formatUppercaseLowerCase, parsePromoteurCSV} from "@/helpers/csvParserHelpers";


describe('csvParserHelpers.js', () => {

  it('should uppercase first letter', () => {

    expect(formatUppercaseLowerCase('sPoNgEBOB SquAREpanTS')).toEqual('Spongebob squarepants');
    expect(formatUppercaseLowerCase('aAAAAAAA')).toEqual('Aaaaaaaa');
    expect(formatUppercaseLowerCase('')).toEqual('');
    expect(formatUppercaseLowerCase(' ')).toEqual(' ');

  });

  it('should make a fancy displayable word', () => {

    expect(cleanWord('   sPoNgEBOB SquAREpanTS    ')).toEqual('Spongebob squarepants');
    expect(cleanWord('   aAAAAAAA    ')).toEqual('Aaaaaaaa');
    expect(cleanWord('')).toEqual('');
    expect(cleanWord(' ')).toEqual('');

  });

  const mockCSV = `PRCLEUNIK,PROMOTEUR,NOMPROG,VILLE,CONTACT
  0,PROMOTEUR1,PROG1,VILLE1,mock@mock.com
  0,PROMOTEUR1,PROG2,VILLE2,mock@mock.com
  1,PROMOTEUR2,PROG3,VILLE3
  1,PROMOTEUR2,PROG4,VILLE4,mock2@mock.com`;

  const resultParseMock = {
    'Promoteur1': {
      PRCLEUNIK:"  0",
      nom: 'Promoteur1',
      programmes: [
        {nom: 'Prog1', ville: 'Ville1'},
        {nom: 'Prog2', ville: 'Ville2'},
      ],
      contact: 'mock@mock.com'
    },
    'Promoteur2': {
      PRCLEUNIK:"  1",
      nom: 'Promoteur2',
      programmes: [
        {nom: 'Prog3', ville: 'Ville3'},
        {nom: 'Prog4', ville: 'Ville4'},
      ],
      contact: 'mock2@mock.com'
    }
  };

  it('should correctly parse a CSV', () => {

    expect(parsePromoteurCSV(mockCSV)).toEqual(resultParseMock);

  });

});
