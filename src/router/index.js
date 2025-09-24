import { createRouter, createWebHashHistory } from 'vue-router'

import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
const routes = [
  { path: '/', name: 'SignIn', component: SignIn },
  {path: '/signup', name:'SignUp',component: SignUp},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
