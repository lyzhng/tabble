import Vue from 'vue';
import App from './App.vue';

console.log('loading index.js!');

new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        template: '<App/>',
        components: { App },
    },
    render: h => h(App),
    mounted: function () {
        console.log('mounted!');
    },
});
