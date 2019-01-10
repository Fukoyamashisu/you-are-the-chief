import React from 'react';
import {render} from 'react-dom';
//BOOTSTRAP
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
//CSS
import './css/index.css';
//COMPONENT
import App from './component/App';
//FONT-AWESOME
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faStar, 
    faCheck, 
    faPlus, 
    faEye, 
    faFileImage, 
    faTrash, 
    faPenSquare, 
    faPencilAlt, 
    faClock, 
    faSearch, 
    faSignInAlt, 
    faSignOutAlt, 
    faTimes, 
    faTimesCircle, 
    faHome
} from '@fortawesome/free-solid-svg-icons';
//FONTAWESOME LIBRARY
library.add(
    faStar, 
    faCheck, 
    faPlus, 
    faEye, 
    faFileImage, 
    faTrash, 
    faPenSquare, 
    faPencilAlt,
    faSignOutAlt, 
    faClock, 
    faSearch, 
    faSignInAlt, 
    faTimes, 
    faTimesCircle, 
    faHome
    );

render(<App />, document.getElementById('root'));
