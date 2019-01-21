import Vue from 'vue'
import UserAnswerCheckbox from '@/components/user/UserAnswerCheckbox'
import {mount} from '@vue/test-utils'

const mockEntry =
  {
    answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}],
    entryID: 'A1'
  };

describe('UserAnswerCheckbox.vue', () => {
  const vm = mount(UserAnswerCheckbox, {
    propsData: {
      ...mockEntry
    }
  });

  it('should have the same number of elem as mock data', () => {
    const boxes = vm.findAll('.user-answer-checkbox');

    expect(boxes.length).toBe(5);

  });

  it('should have options of type "radio"', () => {
    let every = true;
    let options = vm.findAll('input');

    for (let i = 0; i < options.length; ++i) {
      every = every && options.at(i).element.type === 'checkbox';
    }

    expect(every).toBe(true);
  });

  it('should have the same text in option', () => {
    let every = true;
    let options = vm.findAll('input');

    for (let i = 0; i < options.length; ++i) {
      every = every && options.at(i).element.name === vm.props().answers[i].text
    }

    expect(every).toBe(true);
  });

});
