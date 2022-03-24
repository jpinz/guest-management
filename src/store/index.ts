import { createStore, Store } from "vuex";
import VuexPersistence from "vuex-persist";
import router from "@/router";
import { appwrite } from "@/lib/appwrite";
import { Models } from "appwrite";

export type State = {
  account: Models.User<Models.Preferences> | undefined;
  session: Models.Session | null | undefined;
};

const vuexLocal = new VuexPersistence<State>({
  storage: window.localStorage,
});

export default createStore({
  state: {
    account: {},
  } as State,
  mutations: {
    setAccount: (state, account) => (state.account = account),
    setSession: (state, session) => (state.session = session),
  },
  actions: {
    async signInAction({ commit }, { email, password }) {
      try {
        const session = await appwrite.account.createSession(email, password);

        var account = await appwrite.account.get();
        alert("You've Signed In successfully");
        commit("setAccount", account);
        commit("setSession", session);
        await router.push("/");
      } catch (e) {
        console.error("Error thrown:", e);
      }
    },
    async signUpAction({ dispatch }, { email, password, name }) {
      try {
        const account = await appwrite.account.create(
          "unique()",
          email,
          password,
          name
        );
        dispatch("setAccount", account);
        alert("You've been registered successfully");
      } catch (e) {
        console.error("Error thrown:", e);
      }
    },
    async signOutAction({ commit }) {
      try {
        await appwrite.account.deleteSession("current");
        commit("setAccount", null);
        alert("You've been logged Out successfully");
        await router.push("/");
      } catch (e) {
        console.error("Error thrown:", e);
      }
    },
  },
  modules: {},
  getters: {
    account(state) {
      return state.account;
    },
    session(state) {
      return state.session;
    },
  },
  plugins: [],
});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
