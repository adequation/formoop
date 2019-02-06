import Profile from '@/components/general/Profile';
import {mount} from "@vue/test-utils";
import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
import Vuex from 'vuex'
import Vue from 'vue'

const mockedUser = {
  uid: 'abcdefgh123',
  email: 'mock@mocked.com',
  displayName: 'mock mocked'
};


Vue.use(Vuex);

describe('Profile.vue', () => {

  let state;
  let getters;
  let store;


  getters = {
    user: () => mockedUser
  };

  store = new Vuex.Store({
    getters
  });


  //Overrides the current connected user
  //nativeFbFunctions.getCurrentUser = jest.fn(() => (mockedUser));

  const vmSaving = mount(Profile, {
    store
  });

  vmSaving.setData({
    userMetadata: {
      firstName: 'Jhon',
      lastName: 'Doe',
    },
    saving: true,
    edit: true
  });

  it('Should have a saving div when saving', () => {
    let loader = vmSaving.find('.saving');

    expect(!!loader).toBe(true);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmEdition = mount(Profile, {
    store
  });

  vmEdition.setData({
    userMetadata: {
      firstName: 'Jhon',
      lastName: 'Doe',
    },
    saving: false,
    edit: true
  });

  it('Should have text inputs if edit data is true', () => {
    let inputs = vmEdition.findAll('input');

    let atLeastOneTextInput = false;

    for (let i = 0; i < inputs.length; ++i) {
      atLeastOneTextInput = atLeastOneTextInput || inputs.at(i).element.type === 'text';
      if (atLeastOneTextInput) break;
    }

    expect(atLeastOneTextInput).toBe(true);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmNoEdition = mount(Profile, {
    store
  });

  vmNoEdition.setData({
    userMetadata: {
      firstName: 'Jhon',
      lastName: 'Doe',
    },
    saving: false,
    edit: false
  });

  it('Should have a "p" element for the display name if edit data is false', () => {
    let displayName = vmNoEdition.find('.displayName p');

    expect(!!displayName).toBe(true);
  });

});
