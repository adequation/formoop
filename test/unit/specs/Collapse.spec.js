import Collapse from '@/components/containers/Collapse'
import {mount} from '@vue/test-utils'
import * as jest from "jest";

const mockPropsOpenArrow =
  {
    initialyOpened : true,
    showArrow: true
  };

const mockPropsOpenNoArrow =
  {
    initialyOpened : true,
    showArrow: false
  };
const mockPropsClosedArrow =
  {
    initialyOpened : false,
    showArrow: true
  };

const mockPropsClosedNoArrow =
  {
    initialyOpened : false,
    showArrow: false
  };

describe('Collapse.vue', () => {
  const vmOpenArrow = mount(Collapse, {
    propsData: {
      ...mockPropsOpenArrow
    }
  });

  it('Should be opened because of the props', () => {
    const body = vmOpenArrow.find('.collapse-body');

    expect(body.exists()).toBe(true);
  });

  it('Should have an arrow because of the props', () => {
    const arrow = vmOpenArrow.find('.collapse-arrow');

    expect(arrow.exists()).toBe(true);
  });

  it('Should stay opened when we re-open it', () => {
    //First, it is opened
    const bodyBeforeReOpening = vmOpenArrow.find('.collapse-body');
    expect(bodyBeforeReOpening.exists()).toBe(true);

    //We re-open it
    vmOpenArrow.vm.open();

    //We check if it is still opened
    const bodyAfterReOpening = vmOpenArrow.find('.collapse-body');
    expect(bodyAfterReOpening.exists()).toBe(true);
  });

  it('Should not display the body when closed', () => {
    //First, it is opened
    const bodyBeforeClosing = vmOpenArrow.find('.collapse-body');
    expect(bodyBeforeClosing.exists()).toBe(true);

    //We close it
    vmOpenArrow.vm.handleCollapsed();

    //We check if it is closed
    const bodyAfterClosing = vmOpenArrow.find('.collapse-body');
    expect(bodyAfterClosing.exists()).toBe(false);
  });


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmOpenNoArrow = mount(Collapse, {
    propsData: {
      ...mockPropsOpenNoArrow
    }
  });

  it('Should be opened because of the props', () => {
    const body = vmOpenNoArrow.find('.collapse-body');

    expect(body.exists()).toBe(true);
  });

  it('Should not have an arrow because of the props', () => {
    const arrow = vmOpenNoArrow.find('.collapse-arrow');

    expect(arrow.exists()).toBe(false);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmClosedArrow = mount(Collapse, {
    propsData: {
      ...mockPropsClosedArrow
    }
  });

  it('Should not be opened because of the props', () => {
    const body = vmClosedArrow.find('.collapse-body');

    expect(body.exists()).toBe(false);
  });

  it('Should have an arrow because of the props', () => {
    const arrow = vmClosedArrow.find('.collapse-arrow');

    expect(arrow.exists()).toBe(true);
  });

  it('Should stay closed when we re-close it', () => {
    //First, it is closed
    const bodyBeforeReClosing = vmClosedArrow.find('.collapse-body');
    expect(bodyBeforeReClosing.exists()).toBe(false);

    //We re-close it
    vmClosedArrow.vm.close();

    //We check if it is still closed
    const bodyAfterReClosing = vmClosedArrow.find('.collapse-body');
    expect(bodyAfterReClosing.exists()).toBe(false);
  });

  it('Should display the body when opened', () => {
    //First, it is closed
    const bodyBeforeOpening = vmClosedArrow.find('.collapse-body');
    expect(bodyBeforeOpening.exists()).toBe(false);

    //We open it
    vmClosedArrow.vm.handleCollapsed();

    //We check if it is open
    const bodyAfterOpening = vmClosedArrow.find('.collapse-body');
    expect(bodyAfterOpening.exists()).toBe(true);
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const vmClosedNoArrow = mount(Collapse, {
    propsData: {
      ...mockPropsClosedNoArrow
    }
  });

  it('Should not be opened because of the props', () => {
    const body = vmClosedNoArrow.find('.collapse-body');

    expect(body.exists()).toBe(false);
  });

  it('Should not have an arrow because of the props', () => {
    const arrow = vmClosedNoArrow.find('.collapse-arrow');

    expect(arrow.exists()).toBe(false);
  });
});
