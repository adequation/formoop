import {getRandomArrayIndex, parseSentence} from "@/helpers/greetingsHelpers";

describe('greetingsHelpers.js', () => {

  beforeEach(() => {
    jest.resetModules();
  });

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

  const mockGreetings = [
    'g0', 'g1', 'g2'
  ];

  const mockThanks = [
    't0', 't1', 't2'
  ];

  it('Should give a valid index while mocking Math.random()', () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.1;
    global.Math = mockMath;

    for(let i=0; i<1; i += 0.1){
      mockMath.random = () => i;
      global.Math = mockMath;

      expect(
        getRandomArrayIndex(mockGreetings) >= 0
        &&
        getRandomArrayIndex(mockGreetings) < mockGreetings.length
      ).toEqual(true);
    }

  });

  it('Should give the correct greeting', () => {
    jest.mock('../../../src/greetings', () => ({
      greetings : mockGreetings,
      thanks : mockThanks

    }));

    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.1;
    global.Math = mockMath;

    const { getRandomGreeting } = require('@/helpers/greetingsHelpers');

    expect(getRandomGreeting()).toEqual(mockGreetings[0]);

  });

  it('Should give the correct thanks', () => {
    jest.mock('../../../src/greetings', () => ({
      greetings : mockGreetings,
      thanks : mockThanks
    }));

    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.1;
    global.Math = mockMath;

    const { getRandomThankYou } = require('@/helpers/greetingsHelpers');

    expect(getRandomThankYou()).toEqual(mockThanks[0]);

  });

});
