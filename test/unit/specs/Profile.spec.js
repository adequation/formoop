import Profile from '@/components/general/Profile';
import {mount} from "@vue/test-utils";

describe('Profile.vue', () => {

  const vmSaving = mount(Profile, {

  });

  vmSaving.setData({
    firstName:'Jhon',
    lastName:'Doe',
    saving:true,
    edit: true
  });

  it('Should have a saving div when saving', () => {
    let loader = vmSaving.find('.saving');

    expect(!!loader).toBe(true);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmEdition = mount(Profile, {

  });

  vmEdition.setData({
    firstName:'Jhon',
    lastName:'Doe',
    saving: false,
    edit: true
  });

  it('Should have text inputs if edit data is true', () => {
    let inputs = vmEdition.findAll('input');

    let atLeastOneTextInput = false;

    for (let i = 0; i < inputs.length; ++i) {
      console.log(inputs.at(i).element);
      atLeastOneTextInput = atLeastOneTextInput || inputs.at(i).element.type === 'text';
      if(atLeastOneTextInput) break;
    }

    expect(atLeastOneTextInput).toBe(true);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmNoEdition = mount(Profile, {

  });

  vmNoEdition.setData({
    firstName:'Jhon',
    lastName:'Doe',
    saving: false,
    edit: false
  });

  it('Should have a "p" element for the display name if edit data is false', () => {
    let displayName = vmNoEdition.find('.displayName p');

    expect(!!displayName).toBe(true);
  });

});
