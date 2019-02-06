import Vue from 'vue'
import { mount } from '@vue/test-utils'
import CreatorFormEntry from "../../../src/components/creator/CreatorFormEntry";

const mockEntry = {
  entry: {
    answers: [{id:"Q01",text:"Option 1"}],
    id:"Entry01",
    index:0,
    question: {title: "Titre de la question"},
    required: false,
    type:"radio"
  },
  initialyOpened: true,
  formSections: []
};

describe('CreatorFormEntry.vue', () => {

  const wrapper = mount(CreatorFormEntry, {
    propsData: {
      ...mockEntry
    }
  });

  it('should emit requirement change when cliked', () => {
    const checkbox = wrapper.find('.creator-form-entry-requirement');
    checkbox.trigger('click');

    expect(wrapper.emitted()).toBeTruthy();



  });

});
