<template>
  <header>
    <nav>
      <router-link to="/" class="button" v-if="user">Events</router-link>
      <router-link to="account" class="button" v-if="user">Account</router-link>
      <router-link to="userlist" class="button" v-if="user">User List</router-link>
      <router-link to="social" class="button" v-if="social">Social Settings</router-link>
      <router-link to="social/blacklist" class="button" v-if="risk">Blacklist</router-link>
      <router-link to="sign-in" class="button" v-if="!user">Login</router-link>
      <router-link to="sign-up" class="button" v-if="!user">Register</router-link>
      <a class="button" v-on:click="signOut" v-if="user">Log out</a>
    </nav>
  </header>
</template>
