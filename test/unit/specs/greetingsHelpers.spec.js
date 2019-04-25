import {getGenericQuestionTitle} from "@/helpers/genericQuestionHelpers";
import {parseSentence} from "@/helpers/greetingsHelpers";

describe('greetingsHelpers.js', () => {

  it('Should parse sentences correctly', () => {
    const mockSentences = [
      {given: 'Hello good friend !', expected: 'Hello good friend !', params: {}},
      {given: 'Hello good friend !', expected: 'Hello good friend !', params: {good: 'GOOD'}},
      {given: 'Hello @good friend !', expected: 'Hello GOOD friend !', params: {good: 'GOOD'}},
      {given: 'Hello @good friend !', expected: 'Hello @good friend !', params: {friend: 'FRIEND'}},
      {given: 'Hello my @number friends !', expected: 'Hello my 12 friends !', params: {number: 12}},
    ];

    mockSentences.forEach(sentence => {
      expect(parseSentence(sentence.given, sentence.params)).toEqual(sentence.expected);
    });

  });

});
