import {getGenericQuestionTitle} from "@/helpers/genericQuestionHelpers";


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

});
