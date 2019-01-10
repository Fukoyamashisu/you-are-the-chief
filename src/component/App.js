import React, {Component} from 'react';
import Public from './Public';
import Firebase from 'firebase';
import Admin from './Admin';
import Connexion from './Connexion';
import Menu from './Menu';

class App extends Component {

state={
  scroll:"",
  uid:false
}
  componentWillMount() {
    Firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          if(localStorage.getItem("theChief") === user.uid){
            this.setState({uid:true});
          }
        } else {
          return;
        }
      }.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
	}
  connexion = (connect) => {
    this.setState({uid:connect})
  }

  openConnect = () => {
    document.getElementById('register').classList.add('display');
    document.getElementById('connexion').classList.toggle('display');
    document.getElementById('connexion').style.top=`${this.state.scroll}px`;
  }
  openRegister = () => {
    document.getElementById('connexion').classList.add('display');
    document.getElementById('register').classList.toggle('display');
    document.getElementById('register').style.top=`${this.state.scroll}px`;
  }
  signOut =() => {
    Firebase.auth().signOut();
    localStorage.removeItem('theChief');
    this.setState({uid:false})
  }




  render() {


    return (
        <div>
          {this.state.uid === false &&
          <div>
            <div id="connect" className="container-fluid" >
              <div className="row align-items-center">
                <div className="col-md-5">
                  <div className="row justify-content-center">
                    <h1>You Are The Chief!</h1>
                  </div>
                </div>
                <div className="col-md-5 offset-md-2">
                  <div className="row justify-content-center" style={{margin:"10px"}}>
                  <div style={{textAlign:"center"}}>
                    <button style={{marginBottom:"5px"}} onClick={() => this.openConnect()}>Connexion</button>
                    <p onClick={() => this.openRegister()}>Pas encore inscrit ? creer ton compte.</p>
                  </div>
                   <button id="registerButton" onClick={() => this.openRegister()}>Inscription</button>
                  </div>
                </div>
              </div>
            </div>
          <Connexion pathChange={this.pathChange} connexion={this.connexion}/>
          </div>
        }
        {this.state.uid === true &&
         <Menu signOut={this.signOut}/>
        }
        {this.state.uid === false &&
         <Public />
        }
        {this.state.uid === true &&
         <Admin />
        }
      </div>
    );
  }
}

export default App;
