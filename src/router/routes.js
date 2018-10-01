import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import Error404 from '../components/Error404.vue';
import Dashboard from '../components/Dashboard.vue';
import Account from '../components/Account.vue';
import Party from '../components/Party.vue';
import CreateParty from '../components/CreateParty.vue';
import SocialAdmin from '../components/SocialAdmin.vue';
import Blacklist from '../components/Blacklist.vue';
import UserList from '../components/UserList.vue';

// This is where you add all your site routes
// Each route is set as an object in the array
// For a the most basic route just set
// the path & component to load

export const routes = [
  //Redirects
  {path: '/party/account', redirect: '/account'},
  {path: '/party/social', redirect: '/social'},
  {path: '/party/userlist', redirect: '/userlist'},

  {path: '/social/account', redirect: '/account'},
  {path: '/social/social', redirect: '/social'},
  {path: '/social/userlist', redirect: '/userlist'},

  //Routes
  {
    path: '/sign-in',
    name: 'signIn',
    component: SignIn
  },
  {
    path: '/sign-up',
    name: 'signUp',
    component: SignUp
  },
  {
    path: '',
    name: 'parties',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/createParty',
    name: 'createParty',
    component: CreateParty,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/social',
    name: 'social',
    component: SocialAdmin,
    meta: {
      requiresAuth: true,
      requiresSocial: true,
    }
  },
  {
    path: '/social/blacklist',
    name: 'blacklist',
    component: Blacklist,
    meta: {
      requiresAuth: true,
      requiresSocial: true,
    }
  },
  {
    path: '/party/:id',
    name: 'party',
    component: Party,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/userlist',
    name: 'userlist',
    component: UserList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: Error404
  },
  {
    path: '*',
    redirect: '/404'
  }
]
