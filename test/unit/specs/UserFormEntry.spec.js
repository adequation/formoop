import Vue from 'vue'
import UserFormEntry from '@/components/user/UserFormEntry'
import {mount} from "@vue/test-utils";

const mockEntry =
  {
    question: {title: 'Question 1'},
    answer: {type: 'checkbox', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    id: 'Q1',
    alreadyAnswered: false
  };

describe('UserFormEntry.vue', () => {
  const vm = mount(UserFormEntry, {
    propsData: {
      entry : mockEntry
    }
  });

  it('title should be same as mock', () => {
    expect(vm.find('#title').text())
      .toEqual(vm.props().entry.question.title)
  });
});
