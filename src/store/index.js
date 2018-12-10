import Vuex from 'vuex'
import Vue from 'vue'
import creatorStore from '@/store/creatorStore'
import userStore from '@/store/userStore'
import supervisorStore from "@/store/supervisorStore";
import generalStore from "@/store/generalStore";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    generalStore,
    creatorStore,
    supervisorStore,
    userStore
  }
})
