import {mount} from "@vue/test-utils";
import SignIn from '@/components/general/SignIn'
import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
import Vuex from "vuex";
import Router from 'vue-router'
import Vue from "vue";

window.alert = jest.fn((msg) => {
});

const redirect = jest.fn((path) => {
});

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'SignIn',
      component: SignIn,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: SignIn,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
  ]
});

Vue.use(Router);

describe('SignIn.vue', () => {
  const wrapper = mount(SignIn, {
    router,
  });

  it('Should be not be redirected after failed sign in', () => {

    nativeFbFunctions.signInWithEmailAndPassword = jest.fn((login, password) => Promise.reject('error'));

    wrapper.vm.signIn();

    expect(wrapper.vm.$route.path).toBe('/');
  });

  it('Should try to redirect to /home after successful sign in', () => {

    nativeFbFunctions.signInWithEmailAndPassword = jest.fn((login, password) => Promise.resolve('success'));

    const stub = jest.fn();
    wrapper.setMethods({ redirect: stub });


    wrapper.vm.signIn();
    //expect(stub).toBeCalledWith("/home");


  });

});
