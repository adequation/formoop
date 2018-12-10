import Vue from 'vue'
import UserAnswerSelect from '@/components/user/UserAnswerSelect'
import { mount } from '@vue/test-utils'

const mockEntry =
  {
    answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}],
    entryID: 'A1'
  };

describe('UserAnswerSelect.vue', () => {
  const vm = mount(UserAnswerSelect, {
    propsData: {
      ...mockEntry
    }
  });

  it('should have the same number of elem as mock data', () => {
    const listOfElem = vm.findAll('option');

    expect(listOfElem.length).toBe(5+1); //+1 for the empty answer

  });

  it('should have the same text in option', () => {
    let every = true;
    let options = vm.findAll('option');

    for (let i = 1; i < options.length; ++i) { //+1 for the empty answer
      every = every && options.at(i).text() === vm.props().answers[i-1].text
    }

    expect(every).toBe(true);
  });
});
