import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueFroala from 'vue-froala-wysiwyg'
import { initializeApp } from "firebase/app";

import App from './App.vue'
import router from './router'
import * as firebaseConfig from "./firebase.json"

import './styles/main.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
library.add(faBars, faPencil, faXmark)

initializeApp(firebaseConfig);
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueFroala)
app.component('FAIcon', FontAwesomeIcon)
app.mount('#app')
