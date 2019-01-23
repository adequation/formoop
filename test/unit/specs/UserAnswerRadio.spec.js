import Vue from 'vue'
import UserAnswerRadio from '@/components/user/UserAnswerRadio'
import { mount } from '@vue/test-utils'
import * as Firebase from "firebase";
import {firebaseConfig} from "@/firebaseConfig";

const mockEntry =
  {
    answers: [{text: 'a'}, {text: 'b'}, {text: 'c'}, {text: 'd'}, {text: 'e'}],
    entryID: 'A1'
  };

const mockEntry2 =
  {
    answers: [{text: 'a', id: 'azerty'}, {text: 'b', id: 'b8jazaze'}, {text: 'c', id: 'lazohel'}, {text: 'd', id: 'kjazelk'}, {text: 'e', id: 'ljhazlk'}],
    entryID: 'A2',
    currentUserAnswers: 'b8jazaze'
  };


Firebase.initializeApp(firebaseConfig);

describe('UserAnswerRadio.vue', () => {
  const vm = mount(UserAnswerRadio, {
    propsData: {
      ...mockEntry
    }
  });


  it('should have the same number of elements as mock data', () => {
    const radios = vm.findAll('.user-answer-radio');
    expect(radios.length).toBe(5);
  });

  it ('currentUserAnswers should be undefined', () => {
    expect(vm.props().currentUserAnswers).toBe(undefined);
  });

  it('should have options of type "radio"', () => {
    let every = true;
    let options = vm.findAll('input');

    for (let i = 0; i < options.length; ++i) {
      every = every && options.at(i).element.type === 'radio';
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

  it ('should emit when clicked', () => {
    let options = vm.findAll('.user-answer-radio');
    options.at(0).trigger('click');
    expect(vm.emitted()).toBeTruthy();
  });


  const vm2 = mount(UserAnswerRadio, {
    propsData: {
      ...mockEntry2
    }
  });


  it ('should be only one selected', () => {
    let options = vm2.findAll('.user-answer-radio-selected');
    expect(options.length).toBe(1);
  });



});
