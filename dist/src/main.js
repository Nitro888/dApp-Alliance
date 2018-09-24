let main  = require('./main.vue');
Vue.component('mainvue', main.default);

new Vue({el: '#mainvue'});
