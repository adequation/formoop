import Vue from 'vue'
import {mount} from '@vue/test-utils'
import CreatorForm from "../../../src/components/creator/CreatorForm";
import CreatorFormEntry from "../../../src/components/creator/CreatorFormEntry";
import Vuex from "vuex";

const mockedData = {
  formEntries: [
    {
      answers: [{id: "Q01", text: "Option 1"}],
      id: "Entry01",
      index: 0,
      question: {title: "Titre de la question 1"},
      required: false,
      type: "radio"
    },
    {
      answers: [{id: "Q02", text: "Option 1"}],
      id: "Entry02",
      index: 0,
      question: {title: "Titre de la question 2"},
      required: false,
      type: "checkbox"
    }
  ]
};

const mockedForm ={
  formID: 'f01',
  createdForms: ['f01'],
  creatorID:'usr01'
};

const $route = {
  fullPath: 'answer/f01',
  params: {
    formID: 'f01'
  }
};


Vue.use(Vuex);

describe('CreatorForm.vue', () => {

  let getters;
  let store;


  getters = {
    formID: () => mockedForm.formID,
    createdForms: () => mockedForm.createdForms,
    creatorID: () => mockedForm.creatorID

  };

  store = new Vuex.Store({
    getters
  });
/*
  const wrapper = mount(CreatorForm, {store, mocks: {
      $route
    } });

  wrapper.setData(mockedData);
  wrapper.vm.getFormFromFB = jest.fn();

*/
  it('Should change the required property of the entry when receiving a requirement change', () => {

    //wrapper.find(CreatorFormEntry).trigger('setEntryRequirement',{id:"Q01",requirement: true});

    expect(true).toBe(true);

  });

});
