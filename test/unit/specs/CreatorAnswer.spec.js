import Vue from 'vue'
import CreatorAnswer from '@/components/creator/CreatorAnswer'
import CreatorAnswerList from '@/components/creator/CreatorAnswerList'
import { mount } from '@vue/test-utils'
import {inputTypes} from "../mock/inputTypes";

const mockProps = {
    answers: [],
    types: inputTypes,
    type : {},
    entryID: 'id'
};

describe('CreatorAnswer.vue', () => {

  const vmUndefinedType = mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: 'undefinedType'
    }
  });

  it('when type is undefined, option should be a paragraph element', () => {
    expect(vmUndefinedType.contains('p')).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmText = mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: 'text'
    }
  });

  it('when type equals text, option should be a paragraph element', () => {
    expect(vmText.contains('p')).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmTextArea = mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: 'textarea'
    }
  });

  it('when type equals textarea, option should be a paragraph element', () => {
    expect(vmTextArea.contains('p')).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmRadio = mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: inputTypes.find(t => t.value === 'radio').value
    }
  });

  it('when type equals radio, option should be a CreatorAnswerList', () => {
    expect(vmRadio.contains(CreatorAnswerList)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmCheckbox= mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: 'checkbox'
    }
  });

  it('when type equals checkbox, option should be a CreatorAnswerList', () => {
    expect(vmCheckbox.contains(CreatorAnswerList)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmSelect = mount(CreatorAnswer, {
    propsData: {
      ...mockProps,
      type: 'radio'
    }
  });

  it('when type equals select, option should be a CreatorAnswerList', () => {
    expect(vmSelect.contains(CreatorAnswerList)).toBe(true)
  });
});
