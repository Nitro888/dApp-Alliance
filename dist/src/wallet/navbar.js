let navbar  = require('./navbar.vue');
Vue.component('navbar', navbar.default);

module.exports        = new Vue({el: '#navbar'});
