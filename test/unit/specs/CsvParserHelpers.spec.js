import {
  cleanWord,
  formatUppercaseLowerCase,
  MISSING_ID,
  NO_ROWS_PARSED,
  parseEntitiesCSV
} from "@/helpers/csvParserHelpers";


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
  
  1,PROMOTEUR2,PROG3,VILLE3, mock21@mock.com
  
  
  1,PROMOTEUR2,PROG4,VILLE4,mock22@mock.com`;

  const resultParseMock = {
    errors: [],
    warnings : [
      {message: MISSING_ID, place: 'Ligne 3 du CSV'},
      {message: MISSING_ID, place: 'Ligne 5 du CSV'},
      {message: MISSING_ID, place: 'Ligne 6 du CSV'},
    ],
    data: {
      'PROMOTEUR1': {
        id:'PROMOTEUR1',
        PRCLEUNIK: ["0", "0"],
        PROMOTEUR: ['PROMOTEUR1', 'PROMOTEUR1'],
        NOMPROG: ['PROG1', 'PROG2'],
        VILLE: ['VILLE1', 'VILLE2'],
        CONTACT: ['mock@mock.com', 'mock@mock.com']
      },
      'PROMOTEUR2': {
        id:'PROMOTEUR2',
        PRCLEUNIK: ["1", "1"],
        PROMOTEUR: ['PROMOTEUR2', 'PROMOTEUR2'],
        NOMPROG: ['PROG3', 'PROG4'],
        VILLE: ['VILLE3', 'VILLE4'],
        CONTACT: ['mock21@mock.com', 'mock22@mock.com']
      }
    }
  };

  it('should correctly parse a CSV', () => {

    expect(parseEntitiesCSV(mockCSV, 'PROMOTEUR')).toEqual(resultParseMock);

  });

  it('should have every column missing ID warnings, and a no row parsed error', () => {

    const mockedWarnings = [
      {message: MISSING_ID, place: 'Ligne 1 du CSV'},
      {message: MISSING_ID, place: 'Ligne 2 du CSV'},
      {message: MISSING_ID, place: 'Ligne 3 du CSV'},
      {message: MISSING_ID, place: 'Ligne 4 du CSV'},
      {message: MISSING_ID, place: 'Ligne 5 du CSV'},
      {message: MISSING_ID, place: 'Ligne 6 du CSV'},
      {message: MISSING_ID, place: 'Ligne 7 du CSV'},
    ];

    const mockedErrors = [
      {message: NO_ROWS_PARSED, place : 'Tout le fichier'},
    ];

    const expected = parseEntitiesCSV(mockCSV, 'missingID');

    expect(expected.warnings).toEqual(mockedWarnings);
    expect(expected.errors).toEqual(mockedErrors);

  });

});
