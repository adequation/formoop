import Vue from 'vue'
import UserAnswerTextarea from '@/components/user/UserAnswerTextarea'
import { mount } from '@vue/test-utils'

const mockEntry =
  {
    answers: [],
    entryID: 'A1'
  };

describe('UserAnswerTextarea.vue', () => {

  const vm = mount(UserAnswerTextarea, {
    propsData: {
      ...mockEntry
    }
  });

  it('should contain a textArea', () => {
    const textarea = vm.find('.answerTextarea textarea');

    expect(!!textarea).toBe(true);
  })

});
