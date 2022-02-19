import { createApp } from "vue";
import App from "./App.vue";
import { supabase } from "@/lib/supabase";
import { userSession } from "@/utils/auth/useAuth";
import router from "./router";
import store from "./store";
import { Inkline, components } from "@inkline/inkline";
import "@inkline/inkline/inkline.scss";

import "./main.scss";

const app = createApp(App);

app
  .use(Inkline, {
    components,
  })
  .use(router)
  .use(store)
  .mount("#app");

/**
 * Keeps track of if the user is logged in or out and will update userSession state accordingly.
 */
supabase.auth.onAuthStateChange((event, session) => {
  userSession.value = session;
});
