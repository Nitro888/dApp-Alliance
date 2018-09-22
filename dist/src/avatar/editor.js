let editor  = require('./editor.vue');
Vue.component('editor', editor.default);

module.exports      = new Vue({el: '#editor'});
