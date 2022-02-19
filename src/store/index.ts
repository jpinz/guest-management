import { createStore, Store } from "vuex";
import { User } from "@supabase/gotrue-js/dist/main/lib/types";
import createPersistedState from "vuex-persistedstate";
import { supabase } from "@/lib/supabase";
import router from "@/router";
import { ApiError } from "@supabase/supabase-js";

export type State = {
  user: User | null | undefined;
};

export default createStore({
  state: {
    user: {},
  } as State,
  mutations: {
    setUser(state, user: User): void {
      state.user = user;
    },
  },
  actions: {
    async signInAction({ commit }, { email, password }) {
      try {
        const { error, user } = await supabase.auth.signIn({
          email: email,
          password: password,
        });

        if (error) throw error;
        // No error throw, but no user detected so send magic link
        if (!error && !user) {
          alert("Check your email for the login link!");
        }
        alert("You've Signed In successfully");
        await router.push("/");
        commit("setUser", user as User);
      } catch (e) {
        const error = e as ApiError;
        console.error("Error thrown:", error.message);
        alert(error.message || error);
      }
    },
    async signUpAction({ dispatch }, form) {
      try {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        alert("You've been registered successfully");
        await dispatch("signInAction", form);
      } catch (e) {
        const error = e as ApiError;
        console.error("Error thrown:", error.message);
        alert(error.message || error);
      }
    },
    async signOutAction({ commit }) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        commit("setUser", null);
        alert("You've been logged Out successfully");
        await router.push("/");
      } catch (e) {
        const error = e as ApiError;
        console.error("Error thrown:", error.message);
        alert(error.message || error);
      }
    },
  },
  modules: {},
  getters: {
    user(state) {
      return state.user;
    },
    email(state) {
      return state.user?.email;
    },
  },
  plugins: [createPersistedState()],
});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
