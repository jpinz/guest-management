import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    uid: ''
  },
  getters: {
    getUser: state => {
      return state.user
    }
  },
  mutations: {
    setUser: state => {
      state.user = Firebase.auth().currentUser
      state.uid = state.user.email.substr(0, state.user.email.indexOf('@'))
    }
  },
  actions: {
    setUser: context => {
      context.commit('setUser')
    },

  }
})
