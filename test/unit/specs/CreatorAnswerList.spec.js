import Vue from 'vue';
import CreatorAnswerList from '@/components/creator/CreatorAnswerList';
import {createWrapper, mount} from "@vue/test-utils";

const mockProps1 = {
  answers: [{id: 'a', text: 'Option 1'}, {id: 'b', text: 'Option 2'}, {id: 'c', text: 'Option 3'}],
  type: 'radio',
  entryID: 'id'
};

const mockProps2 = {
  answers: [{id: 'a', text: 'Option 1'}],
  type: 'radio',
  entryID: 'id'
};



describe('CreatorAnswerList.vue', () => {
  const vm = mount(CreatorAnswerList, {
    propsData: {
      ...mockProps1
    }
  });

  it('There should be 3 answers', () => {
    expect(vm.findAll('.option').length).toBe(3);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  it('Option values should be same as mock props', () => {

    let every = true;
    let optionInputs = vm.findAll('.option input[type=text]');

    for (let i = 0; i < optionInputs.length; ++i) {
      every = every && optionInputs.at(i).element.value === vm.props().answers[i].text
    }

    expect(every).toBe(true);
  });

  it('Should emit when delete option clicked', () => {
    const button = vm.find('.delete-option-button');
    button.trigger('click');
    expect(vm.emitted()).toBeTruthy();
  });

  it('Should emit right entryID', () => {
    let button = vm.find('#deleteButton0');
    button.trigger('click');
    const rootWrapper = createWrapper(vm.vm.$root);
    expect(rootWrapper.emitted('delete-entry-option')[0][1]).toEqual('a');
  });

  it('Should emit when add option clicked', () => {
    const button = vm.find('.add-option-button');
    button.trigger('click');
    expect(vm.emitted()).toBeTruthy();
  });

  it('Should emit when edit option clicked', () => {
    const text = vm.find('input[type=text]');
    text.trigger('changed');
    expect(vm.emitted()).toBeTruthy();
  });

  it('Should emit same text that in text arrea', () => {
    const text = vm.find('input[type=text]');
    text.setValue('new text');
    const rootWrapper = createWrapper(vm.vm.$root);
    expect(rootWrapper.emitted('edit-entry-option')[0][2]).toEqual(text.element.value);
  });

  it('Click should not work', () => {
    const radioButtons = vm.findAll('input[type=radio]');
    radioButtons.at(0).trigger('click');
    expect(radioButtons.at(0).element.checked).toBe(true);
  });


  const vm2 = mount(CreatorAnswerList, {
    propsData: {
      ...mockProps2
    }
  });

  it('Sould not emit if the only element is deleted', () => {
    let button = vm2.find('.delete-option-button');
    button.trigger('click');
    expect(vm2.emitted('.delete-option-button')).toBeUndefined();
  });



});

