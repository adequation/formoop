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
    let options = vm.findAll('input');
    options.at(0).trigger('click');
    expect(vm.emitted()).toBeTruthy();
  });

  it ('sould e true if clicked', () => {
    let options = vm.findAll('input');
    options.at(2).trigger('click');
    expect(options.at(2).element.checked).toBe(true);
  });



});
