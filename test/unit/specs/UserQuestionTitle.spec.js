import Vue from 'vue'
import UserQuestionTitle from '@/components/user/UserQuestionTitle'
import { mount } from '@vue/test-utils'

const mockEntry =
  {
    question: {title: 'What time is it ?'}
  };

describe('UserQuestionTitle.vue', () => {
  const vm = mount(UserQuestionTitle, {
    propsData: {
      ...mockEntry
    }
  });

  it('Should display the same text as in mock data', () => {
    const title = vm.find('#title');

    expect(title.text()).toBe(mockEntry.question.title);
  })
});
