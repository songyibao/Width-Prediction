export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },

  { path: '/data-table', icon: 'table', component: './DataTable/DataTable'},
  { path: '/welcome', icon: 'smile', component: './Welcome'},
  { path: '/', redirect: '/data-table' },
  { path: '*', layout: false, component: './404' },
];
