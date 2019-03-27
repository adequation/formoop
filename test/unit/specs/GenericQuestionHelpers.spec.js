import {getGenericQuestionTitle, isFormGeneric} from "@/helpers/genericQuestionHelpers";


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

    const expected = 'Mocked (generic) question (with) (variables) ?';

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
  })

});
