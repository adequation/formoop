import {filterEntries, getPercentage, getRawPercentage, isAnswered} from "@/helpers/userAnswersHelpers";

const mockedEntries = [
    {
      id: 'entry1'
    },
    {
      id: 'entry2'
    },
    {
      id: 'entry3'
    },
    {
      id: 'entry4'
    }
  ]
;

const mockedAnswers = {
  entry1: {
    'user1': 'a',
    'user2': 'a',
    'user3': 'b',
    'user4': 'a',
  },
  entry3: {
    'user1': 'a',
  },
  entry4: {
    'user1': 'c',
    'user2': 'b',
    'user3': 'b',
  }
};

describe('userAnswersHelpers.js', () => {

  it('Should know if the entry as been answered', () => {
    expect(isAnswered(mockedEntries[0], mockedAnswers)).toEqual(true);
  });

  it('Should know if the entry as not been answered', () => {
    expect(isAnswered(mockedEntries[1], mockedAnswers)).toEqual(false);
  });

  it('Should get false if the answers does not exists', () => {
    expect(isAnswered(mockedEntries[1], undefined)).toEqual(false);
  });

  it('Should get the correct number of filtered entries', () => {
    expect(filterEntries('answered', mockedEntries, mockedAnswers).length).toEqual(3);
    expect(filterEntries('notAnswered', mockedEntries, mockedAnswers).length).toEqual(1);
    expect(filterEntries('unknownFilter', mockedEntries, mockedAnswers).length).toEqual(mockedEntries.length);
  });

  it('Should get the correct answer percentage', () => {
    expect(getRawPercentage('answered', mockedEntries, mockedAnswers)).toEqual(3/4);
    expect(getRawPercentage('notAnswered', mockedEntries, mockedAnswers)).toEqual(1/4);
    expect(getRawPercentage('unknownFilter', mockedEntries, mockedAnswers)).toEqual(1);
  });

  it('Should get the correct answer percentage times one hundred', () => {
    expect(getPercentage('answered', mockedEntries, mockedAnswers)).toEqual(3/4 * 100);
    expect(getPercentage('notAnswered', mockedEntries, mockedAnswers)).toEqual(1/4 * 100);
    expect(getPercentage('unknownFilter', mockedEntries, mockedAnswers)).toEqual(100);
  });

});
