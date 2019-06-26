import {
  activeParticipantNumber,
  answerAmount, answerArray,
  coesion,
  cohesion, conflictedEntries,
  filterEntries, getEntryAnswers,
  getPercentage,
  getRawPercentage,
  isAnswered, isEntryInConflict, sameAnswers, sameAnswersArray, userAnswerGroup, isEntryUpdated, areAnswersUpdated
} from "@/helpers/userAnswersHelpers";
import {getEntryAnsweringPath} from "@/helpers/firebaseHelpers";

const mockedEntries = [
    {
      id: 'entry1',
      answer:{
        answers:[
          {id:'a', text:'a'},
        ]
      }
    },
    {
      id: 'entry2',
      answer:{
        answers:[
          {id:'b', text:'b'},
          {id:'c', text:'c'},
        ]
      }
    },
    {
      id: 'entry3',
      answer:{
        answers:[
          {id:'a', text:'a'},
          {id:'b', text:'b'},
          {id:'c', text:'c'},
        ]
      }
    },
    {
      id: 'entry4',
      answer:{
        answers:[
          {id:'b', text:'b'},
          {id:'c', text:'c'},
        ]
      }
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

  //answer equality testing
  it('Should get the correct answer percentage times one hundred', () => {
    expect(getEntryAnswers('entry1', mockedAnswers)).toEqual(mockedAnswers['entry1']);
  });

  it('Same answer array should be equal', () => {
    const mockAnswerArray1 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const mockAnswerArray2 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    expect(sameAnswersArray(mockAnswerArray1, mockAnswerArray2)).toEqual(true);
  });

  it('Same answer array but not in the same order should be equal', () => {
    const mockAnswerArray1 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const mockAnswerArray2 = ['a3', 'a4', 'a1', 'a5', 'a2'];
    expect(sameAnswersArray(mockAnswerArray1, mockAnswerArray2)).toEqual(true);
  });

  it('Different answer arrays shoul be different', () => {
    const mockAnswerArray1 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const mockAnswerArray2 = ['a1', 'a2', 'a3'];
    const mockAnswerArray3 = ['a1', 'a2', 'a3', 'a4', 'a6'];

    expect(sameAnswersArray(mockAnswerArray1, mockAnswerArray2)).toEqual(false);
    expect(sameAnswersArray(mockAnswerArray1, mockAnswerArray3)).toEqual(false);
  });

  it('Same answers should be the same', () => {
    const mockAnswerArray1 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const mockAnswerArray2 = ['a1', 'a2', 'a3', 'a4', 'a5'];

    const mockAnswer1 = 'a1';
    const mockAnswer2 = 'a1';

    expect(sameAnswers(mockAnswerArray1, mockAnswerArray2)).toEqual(true);
    expect(sameAnswers(mockAnswer1, mockAnswer2)).toEqual(true);
  });

  it('Different answers should be different', () => {
    const mockAnswerArray1 = ['a1', 'a2', 'a3', 'a4', 'a5'];
    const mockAnswerArray2 = ['a1', 'a2', 'a3', 'a4', 'a6'];

    const mockAnswer1 = 'a1';
    const mockAnswer2 = 'a2';
    const mockAnswer3 = 12;

    expect(sameAnswers(mockAnswerArray1, mockAnswerArray2)).toEqual(false);
    expect(sameAnswers(mockAnswer1, mockAnswer2)).toEqual(false);
    expect(sameAnswers(mockAnswer1, mockAnswer3)).toEqual(false);
  });


  const mockedConflictAnswers = {
    entry1: {
      'user1': 'a',
      'user2': 'a',
      'user3': 'a',
      'user4': 'a',
    },
    entry3: {
      'user1': 'a',
    },
    entry4: {
      'user1': 'c',
      'user2': 'b',
      'user3': 'b',
    },
    entry5: {
      'user1': ['a', 'b', 'c'],
      'user2': ['c', 'a', 'b'],
      'user3': ['b', 'a', 'c'],
    },
    entry6: {
      'user1': ['a', 'b'],
      'user2': ['c', 'a', 'b'],
      'user3': ['b', 'a', 'c'],
    }
  };

  it('Same entry answers should not be in conflict', () => {

    expect(isEntryInConflict('entry1', mockedConflictAnswers)).toEqual(false);
    expect(isEntryInConflict('entry2', mockedConflictAnswers)).toEqual(false); //does not have answers
    expect(isEntryInConflict('entry3', mockedConflictAnswers)).toEqual(false);
    expect(isEntryInConflict('entry5', mockedConflictAnswers)).toEqual(false);
  });

  it('Different entry answers should be in conflict', () => {

    expect(isEntryInConflict('entry4', mockedConflictAnswers)).toEqual(true);
    expect(isEntryInConflict('entry6', mockedConflictAnswers)).toEqual(true);
  });

  const entry1 = mockedEntries.find(e => e.id === 'entry1');
  const entry4 = mockedEntries.find(e => e.id === 'entry4');
  const entry6 = {
    id: 'entry6',
    answer:{
      answers:[
        {id:'a', text:'a'},
        {id:'b', text:'b'},
        {id:'c', text:'c'},
      ]
    }
  };

  it('Should get the current amount of questions', () => {

    const mockedAmountE1 = {
      a : 4
    };

    const mockedAmountE4 = {
      c: 1,
      b: 2
    };

    const mockedAmountE6 = {
      a : 3,
      b: 3,
      c: 2
    };

    expect(answerAmount(entry1, mockedConflictAnswers)).toEqual(mockedAmountE1);
    expect(answerAmount(entry4, mockedConflictAnswers)).toEqual(mockedAmountE4);
    expect(answerAmount(entry6, mockedConflictAnswers)).toEqual(mockedAmountE6);
  });

  it('Should get the correct answer array', ()=> {
    const answerArrayE1 =  answerArray(entry1, mockedConflictAnswers);
    const answerArrayE4 =  answerArray(entry4, mockedConflictAnswers);
    const answerArrayE6 =  answerArray(entry6, mockedConflictAnswers);

    const expectedAnswerArrayE1 = [4];
    const expectedAnswerArrayE4 = [1, 2];
    const expectedAnswerArrayE6 = [3, 3, 2];

    expect(answerArrayE1).toEqual(expectedAnswerArrayE1);

    expect(answerArrayE4.length === expectedAnswerArrayE4.length).toEqual(true);
    expect(answerArrayE4.every(a => expectedAnswerArrayE4.includes(a))).toEqual(true);

    expect(answerArrayE6.length === expectedAnswerArrayE6.length).toEqual(true);
    expect(answerArrayE6.every(a => expectedAnswerArrayE6.includes(a))).toEqual(true);

  });

  it('Should get the correct answer group', ()=> {
    const userAnswerGroupE1 = userAnswerGroup('entry1', mockedConflictAnswers);
    const userAnswerGroupE4 = userAnswerGroup('entry4', mockedConflictAnswers);
    const userAnswerGroupE6 = userAnswerGroup('entry6', mockedConflictAnswers);

    const expectedAnswerArrayE1 = {a: ['user1', 'user2', 'user3', 'user4']};
    const expectedAnswerArrayE4 = {b: ['user2', 'user3'], c: ['user1']};
    const expectedAnswerArrayE6 = {a: ['user1', 'user2', 'user3'], b:['user1', 'user2', 'user3'], c:['user2', 'user3']};

    expect(userAnswerGroupE1).toEqual(expectedAnswerArrayE1);
    expect(userAnswerGroupE4).toEqual(expectedAnswerArrayE4);
    expect(userAnswerGroupE6).toEqual(expectedAnswerArrayE6);
  });

  it('Should get all the conflicted entries', ()=> {
    const conflicted = conflictedEntries(mockedConflictAnswers);
    const expectedConflictedEntries = ['entry4', 'entry6'];

    expect(conflicted.length === expectedConflictedEntries.length).toEqual(true);
    expect(conflicted.every(e => expectedConflictedEntries.includes(e))).toEqual(true);
  });

  //coesion testing

  it('Cohesion should be undefined if nobody as answered', () => {
    expect(cohesion([0, 0, 0, 0])).toEqual(undefined);
  });

  it('Cohesion should be 0 if no one is agreeing', () => {
    expect(cohesion([1, 1, 1, 1])).toEqual(0);
    expect(cohesion([32, 32, 32, 32])).toEqual(0);
  });

  it('Cohesion should be higher then 50%', () => {
    expect(cohesion([50, 0, 0, 50])>0.5).toEqual(true);
    expect(cohesion([10, 10, 0, 0]) > 0.5).toEqual(true);
  });

  it('Cohesion should be 100% if everybody is agreeing', () => {
    expect(cohesion([1, 0, 0, 0])).toEqual(1);
    expect(cohesion([145, 0, 0, 0])).toEqual(1);
  });

  const userAnswersMock = {
    entry1: {
      user1 : 'option1',
      user2 : 'option2',
    },
    entry2: {
      user1 : 'option1',
      user3 : 'option2',
    },
    entry3: {
      user2 : 'option1',
    },
    entry4: {
      user1 : 'option1',
      user2 : 'option1',
      user3 : 'option1',
    },
    entry5: {
      user1 : 'option1',
      user2 : 'option2',
    },
  };

  const userAnswersMock2 = {
    entry1: {
      user1 : 'option1',
    },
    entry2: {
      user1 : 'option2',
    },
    entry3: {
      user1 : 'option3',
    },
    entry4: {
      user1 : 'option1',
    },
    entry5: {
      user1 : 'option2',
    },
  };

  it('Should have no active participants if there is no one or if no one answered', () => {
    expect(activeParticipantNumber(null)).toEqual(0);
    expect(activeParticipantNumber(undefined)).toEqual(0);
    expect(activeParticipantNumber({})).toEqual(0);
  });

  it('Should have 3 active participants', () => {
    expect(activeParticipantNumber(userAnswersMock)).toEqual(3);
  });

  it('Should have only one active participants', () => {
    expect(activeParticipantNumber(userAnswersMock2)).toEqual(1);
  });

  it('Should not be updated if there is no selected answers for the current entry', () => {
    const userEntryAnswersMock = "option1";

    const selectedEntryAnswersMock = undefined;

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(false);
  });

  it('Should be updated if user answer and selected answer for the current entry are different', () => {
    const userEntryAnswersMock = "option1";

    const selectedEntryAnswersMock = "option2";

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(true);
  });

  it('Should not be updated if user answer and selected answer for the current entry are the same', () => {
    const userEntryAnswersMock = "option1";

    const selectedEntryAnswersMock = "option1";

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(false);
  });

  it('Should be updated if selected answers for the current entry are an array but user answer is not an array', () => {
    const userEntryAnswersMock = "option1";

    const selectedEntryAnswersMock = ["option1", "option2"];

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(true);
  });

  it('Should not be updated if selected answers for the current entry is an empty array and the user answer is not an array', () => {
    const userEntryAnswersMock = "option1";

    const selectedEntryAnswersMock = [];

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(false);
  });

  it('Should be updated if selected answers array for the current entry has different length than user answers', () => {
    const userEntryAnswersMock = ["option1"];

    const selectedEntryAnswersMock = ["option1", "option2"];

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(true);
  });

  it('Should be updated if selected answers array for the current entry and user answers have same length but different answers', () => {
    const userEntryAnswersMock = ["option1", "option3"];

    const selectedEntryAnswersMock = ["option1", "option2"];

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(true);
  });

  it('Should not be updated if selected answers array for the current entry and user answers have same length and same answers', () => {
    const userEntryAnswersMock = ["option1", "option2"];

    const selectedEntryAnswersMock = ["option2", "option1"];

    expect(isEntryUpdated(userEntryAnswersMock, selectedEntryAnswersMock)).toBe(false);
  });


  const userIDMock =  "user1";

  it('Should not be updated if selected answers and user answers are the same', () => {
    const userAnswersMock = {
      "entry1" : {"user1" : "a"},
      "entry3" : {"user1" : ["a", "b"]}
    };

    const selectedAnswersMock = {
      "entry1" : "a",
      "entry3" : ["a","b"]
    };

    expect(areAnswersUpdated(userAnswersMock, selectedAnswersMock, mockedEntries, userIDMock)).toBe(false);
  });

  it('Should be updated if selected answers and user answers are different', () => {
    const userAnswersMock = {
      "entry1" : {"user1" : "a"},
      "entry3" : {"user1" : ["a", "b"]}
    };

    const selectedAnswersMock = {
      "entry1" : "a",
      "entry3" : ["a","c"]
    };

    expect(areAnswersUpdated(userAnswersMock, selectedAnswersMock, mockedEntries, userIDMock)).toBe(true);
  });


});
