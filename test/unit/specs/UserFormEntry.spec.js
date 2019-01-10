import Vue from 'vue'
import UserFormEntry from '@/components/user/UserFormEntry'
import {mount} from "@vue/test-utils";
import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

const mockEntry =
  {
    question: {title: 'Question 1'},
    answer: {type: 'checkbox', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    id: 'Q1',
    alreadyAnswered: false
  };

const mockedUser = {
  uid:          'abcdefgh123',
  email:        'mock@mocked.com',
  displayName:  'mock mocked'
};

describe('UserFormEntry.vue', () => {

  //Overrides the current connected user
  nativeFbFunctions.getCurrentUser = jest.fn(() => (mockedUser));

  const vm = mount(UserFormEntry, {
    propsData: {
      entry : mockEntry
    }
  });

  it('title should be same as mock', () => {
    expect(vm.find('.user-question-title').text())
      .toEqual(vm.props().entry.question.title)
  });
});
