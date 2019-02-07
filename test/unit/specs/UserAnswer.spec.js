import Vue from 'vue'
import UserAnswer from '@/components/user/UserAnswer'
import UserAnswerText from '@/components/user/UserAnswerText'
import UserAnswerTextarea from '@/components/user/UserAnswerTextarea'
import UserAnswerRadio from '@/components/user/UserAnswerRadio'
import UserAnswerCheckbox from '@/components/user/UserAnswerCheckbox'
import UserAnswerSelect from '@/components/user/UserAnswerSelect'
import { mount } from '@vue/test-utils'
import * as firebaseHelpers from '@/helpers/firebaseHelpers'
import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
import Vuex from "vuex";

const mockedUser = {
  id: 'abcdefgh123',
  email: 'mock@mocked.com',
  displayName: 'mock mocked'
};


Vue.use(Vuex);

let getters;
let store;


getters = {
  user: () => mockedUser
};

store = new Vuex.Store({
  getters
});

const mockProps =
  {
    answer: {type: 'text', answers: []},
    entryID: 'A1',
    alreadyAnswered: false,
    userAnswers : {}
  };

const mockAlreadyAnswered =
  {
    answer: {type: 'select', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    entryID: 'A1',
    alreadyAnswered: true,
    userAnswers : {}
  };


describe('UserAnswer.vue', () => {

  //Overrides the current connected user
  nativeFbFunctions.getCurrentUser = jest.fn(() => (mockedUser));

  const vmText = mount(UserAnswer, {
    propsData: {
      ...mockProps,
      answer: {type: 'text', answers: []},
    },
    store
  });

  it('when type equals text, there should be a UserAnswerText', () => {
    expect(vmText.contains(UserAnswerText)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmTextArea = mount(UserAnswer, {
    propsData: {
      ...mockProps,
      answer: {type: 'textarea', answers: []},
    },
    store
  });

  it('when type equals textarea, there should be a UserAnswerTextarea', () => {
    expect(vmTextArea.contains(UserAnswerTextarea)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmRadio = mount(UserAnswer, {
    propsData: {
      ...mockProps,
      answer: {type: 'radio', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    },
    store
  });

  it('when type equals radio, there should be a UserAnswerRadio', () => {
    expect(vmRadio.contains(UserAnswerRadio)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmCheckbox= mount(UserAnswer, {
    propsData: {
      ...mockProps,
      answer: {type: 'checkbox', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    },
    store
  });

  it('when type equals checkbox, there should be a UserAnswerCheckbox', () => {
    expect(vmCheckbox.contains(UserAnswerCheckbox)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmSelect = mount(UserAnswer, {
    propsData: {
      ...mockProps,
      answer: {type: 'select', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    },
    store
  });

  it('when type equals select, there should be a UserAnswerSelect', () => {
    expect(vmSelect.contains(UserAnswerSelect)).toBe(true)
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmAlreadyAnswered = mount(UserAnswer, {
    propsData: {
      ...mockAlreadyAnswered,
      answer: {type: 'select', answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}]},
    },
    store
  });

  it('when already aswered, it should not contains any UserAnswer', () => {
    const elem = vmAlreadyAnswered.find('.alreadyAnswered');
    expect(!!elem).toBe(true);
  });
});
