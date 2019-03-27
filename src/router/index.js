import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/general/Main'
import UserForm from '@/components/user/UserForm'
import CreatorForm from '@/components/creator/CreatorForm'
import SignUp from '@/components/general/SignUp'
import SignIn from '@/components/general/SignIn'
import CreatorHome from '@/components/creator/CreatorHome'
import SupervisorDashboard from '@/components/supervisor/SupervisorDashboard'
import PublishedForms from '@/components/general/PublishedForms'
import FormCampaign from '@/components/general/FormCampaign'
import CreatorCampaign from '@/components/creator/CreatorCampaign'
import ClosedForm from '@/components/general/ClosedForm'
import SupervisorCampaignDashboard from '@/components/supervisor/SupervisorCampaignDashboard'
import CSVParser from '@/components/general/CSVParser'

import Firebase from 'firebase';
import CreatorClosedForms from "../components/creator/CreatorClosedForms";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/sign-in'
    },
    {
      path: '/',
      redirect: '/sign-in\''
    },
    {
      path: '/home',
      name: 'Main',
      component: Main,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn,
      meta: {
        requiresAuth: false,
        any: false
      }
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
      meta: {
        requiresAuth: false,
        any: false
      }
    },
    {
      path: '/closedForm',
      name: 'ClosedForm',
      component: ClosedForm,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
    {
      path: '/published',
      name: 'PublishedForms',
      component: PublishedForms,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
    {
      path: '/campaigns',
      name: 'FormCampaign',
      component: FormCampaign,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/campaigns/:campaignID',
      name: 'CreatorCampaign',
      component: CreatorCampaign,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/create/',
      name: 'CreatorHome',
      component: CreatorHome,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/create/:formID',
      name: 'creatorForm',
      component: CreatorForm,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/answer/:formID',
      name: 'userForm',
      component: UserForm,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
    {
      path: '/answer/:formID/:userID',
      name: 'userFormWithID',
      component: UserForm,
      meta: {
        requiresAuth: false,
        any: true
      }
    },
    {
      path: '/monitor/:formID',
      name: 'SupervisorDashboard',
      component: SupervisorDashboard,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/monitor/campaign/:campaignID',
      name: 'SupervisorCampaign',
      component: SupervisorCampaignDashboard,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/closed/',
      name: 'ClosedForms',
      component: CreatorClosedForms,
      meta: {
        requiresAuth: true,
        any: false
      }
    },
    {
      path: '/wip/',
      name: 'WIP',
      component: CSVParser,
      meta: {
        requiresAuth: true,
        any: false
      }
    },

  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = Firebase.auth().currentUser;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const any = to.matched.some(record => record.meta.any);

  if (requiresAuth && !currentUser) next('sign-in');
  else if (!requiresAuth && currentUser && !any) next('/home');
  else next();
});

export default router;
