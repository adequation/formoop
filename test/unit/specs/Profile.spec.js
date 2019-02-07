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

describe('Profile.vue', () => {

  //Overrides the current connected user
  nativeFbFunctions.getCurrentUser = jest.fn(() => (mockedUser));

  const vmNoEdition = mount(Profile);

  it('Should display the admin email', () => {
    let displayName = vmNoEdition.find('.displayName p');

    expect(!!displayName).toBe(true);
  });

});
