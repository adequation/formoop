import Vue from 'vue';
import CreatorAnswerList from '@/components/creator/CreatorAnswerList';
import {mount} from "@vue/test-utils";

const mockProps = {
  answers: [{id: 'a', text: 'Option 1'}, {id: 'b', text: 'Option 2'}, {id: 'c', text: 'Option 3'}],
  type: 'radio',
  entryID: 'id'
};

describe('CreatorAnswerList.vue', () => {
  const vm = mount(CreatorAnswerList, {
    propsData: {
      ...mockProps
    }
  });

  it('There should be 3 answers', () => {
    expect(vm.findAll('.option').length).toBe(3);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  it('Option values should be same as mock props', () => {

    let every = true;
    let optionInputs = vm.findAll('.option input');
    for (let i = 0; i < optionInputs.length; ++i) {
      every = every && optionInputs.at(i).element.value === vm.props().answers[i].text
    }

    expect(every).toBe(true);
  });

});
