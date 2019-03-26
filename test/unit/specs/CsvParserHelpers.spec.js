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

  const mockCSV = `PRCLEUNIK,PROMOTEUR,NOMPROG,VILLE
  0,PROMOTEUR1,PROG1,VILLE1
  0,PROMOTEUR1,PROG2,VILLE2
  1,PROMOTEUR2,PROG3,VILLE3
  1,PROMOTEUR2,PROG4,VILLE4`;

  const resultParseMock = {
    'Promoteur1': {
      nom: 'Promoteur1',
      programmes: [
        {programme: 'Prog1', ville: 'Ville1'},
        {programme: 'Prog2', ville: 'Ville2'},
      ]
    },
    'Promoteur2': {
      nom: 'Promoteur2',
      programmes: [
        {programme: 'Prog3', ville: 'Ville3'},
        {programme: 'Prog4', ville: 'Ville4'},
      ]
    }
  };

  it('should correctly parse a CSV', () => {

    expect(parsePromoteurCSV(mockCSV)).toEqual(resultParseMock);

  });

});
