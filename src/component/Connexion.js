import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Firebase from 'firebase';
import base from '../base';


class Connexion extends Component {

  constructor(props){
    super(props)
    this.pseudoInput = React.createRef();
    this.passwordRegister = React.createRef();
    this.emailRegister = React.createRef();
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.emailReset = React.createRef();
    this.connexionForm = React.createRef();
  }
  state={
    users:{}
  }

  componentWillMount() {
    this.ref = base.syncState('/', {
      context: this,
      state: 'users'
    })
  }
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }


  register = event => {
    event.preventDefault();
    const email = this.emailInput.current.value;
    const password = this.passwordInput.current.value;
    const auth = Firebase.auth();
    auth.createUserWithEmailAndPassword(email, password).catch((error)=>{
      const errorCode = error.code;
      if (errorCode === 'auth/weak-password') {
        document.getElementById('createErrorPassword').innerHTML="Mot de Passe trop faible!";
      }else{
        document.getElementById('createErrorPassword').innerHTML="";
      }
      if (errorCode === 'auth/invalid-email') {
        document.getElementById('createErrorMail').innerHTML="Adresse Email invalide!"
      }else{
        document.getElementById('createErrorMail').innerHTML=""
      }
      if (errorCode === 'auth/email-already-in-use') {
        document.getElementById('createErrorMail').innerHTML="Cette adresse Email à déjà un compte!"
      }
    })
    auth.onAuthStateChanged(function(user) {
      const object={
        nom:this.pseudoInput.current.value
      }
      if (user) {
        const users = {...this.state};
        const connect = true;
        users["users"][`${user.uid}`] = object;
        this.setState(users);
        localStorage.setItem("theChief", `${user.uid}`);
        localStorage.setItem("theChiefPseudo", `${this.pseudoInput.current.value}`);
        this.props.connexion(connect);

      } else {
        return;
      }
    }.bind(this));
  }

  openResetPassword = () => {
    document.getElementById('connexion').classList.add('display');
    document.getElementById('resetPassword').classList.remove('display');
    document.getElementById('resetPassword').style.top=`${this.state.scroll}px`;
    this.emailReset.current.value = this.emailRegister.current.value;
  }

  signIn = event => {
    event.preventDefault();
    const email = this.emailRegister.current.value;
    const password = this.passwordRegister.current.value;
    const auth = Firebase.auth();
    auth.signInWithEmailAndPassword(email, password).catch((error)=>{
      const errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        document.getElementById('connectErrorPassword').innerHTML="Erreur de Mot de Passe";
      }else{
        document.getElementById('connectErrorPassword').innerHTML="";
      }
      if (errorCode === 'auth/invalid-email') {
        document.getElementById('connectErrorMail').innerHTML="Adresse Email invalide!"
      }else{
        document.getElementById('connectErrorMail').innerHTML=""
      }
      if (errorCode === 'auth/user-not-found') {
        document.getElementById('connectErrorMail').innerHTML="Cette adresse Email n'a pas de compte associé! , créer un compte :)"
      }
    })
    auth.onAuthStateChanged(function(user) {
      if (user) {
        const connect = true;
        localStorage.setItem("theChief", `${user.uid}`);
        this.props.connexion(connect);
      } else {
        return;
      }
    }.bind(this));
  }

  resetPassword = event => {
    event.preventDefault();
    var auth = Firebase.auth();
    var emailAddress = this.emailReset.current.value;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      document.getElementById('resetMessage').innerHTML= "E-mail Envoyé";
    }).catch(function(error) {
      // An error happened.
    });
  }

  closeWindow = () => {
    document.getElementById('connexion').classList.add('display');
    document.getElementById('register').classList.add('display');
    document.getElementById('resetPassword').classList.add('display');
  }

  render() {


    return (
      <div className="container-fluid" style={{height:"100%"}}>
        <div id="connexion" className="row align-items-center display" style={{height:"100%"}}>
        <div className="col-xl-4 offset-xl-4 col-sm-8 offset-sm-2  register">
          <h3>Connexion</h3>
          <form id="connectionForm" className="formControl" onSubmit={e => this.signIn(e)}>
            <div className="form-group">
              <label htmlFor="emailRegister">E-mail</label>
              <input type="email" className="form-control mr-md-2" placeholder="E-mail" ref={this.emailRegister}/>
              <p id="connectErrorMail" className="errorMessage"> </p>
            </div>
            <div className="form-group">
              <label htmlFor="passwordRegister">Mot de Passe</label>
              <input type="password" className="form-control mr-md-2" placeholder="Mot de Passe" ref={this.passwordRegister}/>
              <p id="connectErrorPassword" className="errorMessage"> </p>
            </div>
            <p id="connectResetPassword" onClick={() => this.openResetPassword()}>Cliquer ici pour réinitialiser votre mot de passe</p>
            <button type="submit" className="btn btn-block">Connexion</button>
          </form>
          <div className="rightIcon" onClick={() => this.closeWindow()}><FontAwesomeIcon icon="times"/></div>
        </div>
      </div>
      <div id="register" className="row align-items-center display" style={{height:"100%"}}>
        <div className="col-xl-4 offset-xl-4 col-sm-8 offset-sm-2  register">
          <h3>Inscription</h3>
          <form id="registerForm" className="formControl" onSubmit={e => this.register(e)} ref={this.connexionForm}>
            <div className="form-group">
              <label htmlFor="pseudoRegister">Pseudo</label>
              <input type="text" id="pseudoRegister" className="form-control mr-md-2" placeholder="Creer ton Pseudo" ref={this.pseudoInput}/>
              <p id="alreadyLog"></p>
            </div>
            <div className="form-group">
              <label htmlFor="emailRegister">E-mail</label>
              <input type="email" id="emailRegister" className="form-control mr-md-2" placeholder="E-mail" ref={this.emailInput}/>
              <p id="createErrorMail" className="errorMessage"> </p>
            </div>
            <div className="form-group">
              <label htmlFor="passwordRegister">Mot de Passe</label>
              <input type="password" id="passwordRegister" className="form-control mr-md-2" placeholder="Mot de Passe" ref={this.passwordInput}/>
              <p id="createErrorPassword" className="errorMessage"> </p>
            </div>
            <button type="submit" className="btn btn-block">Inscription</button>
          </form>
          <div className="rightIcon" onClick={() => this.closeWindow()}><FontAwesomeIcon icon="times"/></div>
        </div>
      </div>
      <div id="resetPassword" className="row align-items-center display" style={{height:"100%"}}>
      <div className="col-xl-4 offset-xl-4 col-sm-8 offset-sm-2  register">
        <h3>Réinitialiser Mot de Passe</h3>
        <form id="resetForm" className="formControl" onSubmit={e => this.resetPassword(e)}>
          <div className="form-group">
            <label htmlFor="emailReset">E-mail</label>
            <input id="emailReset" type="email" className="form-control mr-md-2" ref={this.emailReset}/>
          </div>
          <p id="resetMessage"> </p>
          <button type="submit" className="btn btn-block">Envoyer</button>
        </form>
        <div className="rightIcon" onClick={() => this.closeWindow()}><FontAwesomeIcon icon="times"/></div>
      </div>
    </div>
    </div>
    );
  }
}

export default Connexion;
