import Vue from 'vue'
import UserAnswerText from '@/components/user/UserAnswerText'
import { mount } from '@vue/test-utils'

const mockEntry =
  {
    answers: [],
    entryID: 'A1',
  };

describe('UserAnswerText.vue', () => {

  const wrapper = mount(UserAnswerText, {
    propsData: {
      ...mockEntry
    }
  });

  it('should contains only one input of type text', () => {
    const text = wrapper.find('.answerText');

    expect(text.element.type).toBe('text');
  })


});
