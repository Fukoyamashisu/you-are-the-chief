import Rebase from 're-base';
import Firebase from 'firebase';
import config from './local.config';

const app = Firebase.initializeApp (config);

const base = Rebase.createClass(app.database());

export default base;
