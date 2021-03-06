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

});
