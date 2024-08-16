import './styles/main.css'
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueFroala from 'vue-froala-wysiwyg'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faPencil, faXmark)

const app = createApp(App)
app.use(createPinia())
app.use(VueFroala)
app.component('FAIcon', FontAwesomeIcon)
app.mount('#app')
