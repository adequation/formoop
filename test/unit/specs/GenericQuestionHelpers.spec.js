import {getGenericQuestionTitle, getPropArrayFromBlock, isFormGeneric} from "@/helpers/genericQuestionHelpers";


describe('genericQuestionTitle.js', () => {

  it('Should encode an adress', () => {
    const mockBlocks = [
      {type: 'text', content: 'Mocked'},
      {type: 'variable', content: 'generic'},
      {type: 'unknownTypeThatIsTextByDefault', content: 'question'},
      {type: 'variable', content: 'with'},
      {type: 'variable', content: 'variables'},
      {type: 'text', content: '?'},
    ];

    const expected = 'Mocked @generic question @with @variables ?';

    expect(getGenericQuestionTitle(mockBlocks)).toEqual(expected);
  });

  it('Should be a generic form', ()=> {
    const mockEntries = [
        {id : 'e0', },
        {id : 'e1', },
        {id : 'e2', },
        {id : 'e3', generic:true},
        {id : 'e4', },
      ];

      expect(isFormGeneric(mockEntries)).toEqual(true);
  });

  it('Should not be a generic form', ()=> {
    const mockEntries = [
        {id : 'e0' },
        {id : 'e1' },
        {id : 'e2' },
        {id : 'e3' },
        {id : 'e4' },
      ];

    expect(isFormGeneric(mockEntries)).toEqual(false);
  });

  it('Should get the correct props path', ()=> {
    const mockBlock = {
      id:'block1',
      type: 'variable',
      content:'firstProp.secondProp.thirdProp.fourthProp'
    };

    const expectedPath = ['firstProp', 'secondProp', 'thirdProp', 'fourthProp'];

    expect(getPropArrayFromBlock(mockBlock)).toEqual(expectedPath);
  })

  it('Should get no props path if block is not a variable', ()=> {
    const mockBlock = {
      id:'block1',
      type: 'test',
      content:'firstProp.secondProp.thirdProp.fourthProp'
    };

    const expectedPath = [];

    expect(getPropArrayFromBlock(mockBlock)).toEqual(expectedPath);
    expect(getPropArrayFromBlock(null)).toEqual(expectedPath);
  })

});
