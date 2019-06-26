// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {firebaseConfig} from "@/firebaseConfig";
import * as Firebase from "firebase";

Vue.config.productionTip = false;

let app = '';

// Firebase init
Firebase.initializeApp(firebaseConfig);

Firebase.auth().onAuthStateChanged(() => {
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      store,
      components: { App },
      template: '<App/>',
      created () {
        this.$store.dispatch('setFormID', {formID: null});

      }
    });
  }
});

