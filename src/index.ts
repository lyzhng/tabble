import Vue from 'vue';
import App from './App';
import Vuex from 'vuex';

console.log('loading index.js!');

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
});

new Vue({
  el: '#app',
  store,
  data: {
    template: '<App/>',
    components: { App },
  },
  render: (h) => h(App),
  mounted: function () {
    console.log('mounted!');
  },
});
