import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Menu extends Component {

  state={
    menu:"Menu",
    recherche:"Rechercher",
    creer:"Creer Recette",
    logOut:"Déconnection"
  }

  openMenu = () => {
    document.getElementById('navMenu').classList.toggle('navMenuLeft');
  }
  openEdit = () => {
    document.getElementById("creationRecette").style.top=`${window.pageYOffset}px`;
    document.getElementById('creationRecette').classList.toggle('display');
    document.getElementById('creationRecette').classList.toggle('slide');
  }
  openSearch = () => {
    document.getElementById('search').classList.toggle('display');
    document.getElementsByClassName('tab-content')[0].classList.toggle('display');
  }
  navHidden = () => {
    document.getElementById('navMenu').classList.add('navMenuLeft');
  }
  navHide = () => {
    document.getElementById('navMenu').classList.add('navMenuLeft');
    document.getElementById('search').classList.add('display');
    document.getElementsByClassName('tab-content')[0].classList.remove('display');
  }
  enterTooltip = (event) => {
    const tooltip = event.currentTarget.getElementsByTagName('span');
    tooltip[0].style.display="block";
  }
  leaveTooltip = (event) => {
    const tooltip = event.currentTarget.getElementsByTagName('span');
    tooltip[0].style.display="none";
  }
  iconText = (str) =>{
    document.getElementById('iconText').innerHTML=`${str}`;
    document.getElementById('iconText').classList.remove('display');
  }
  iconTextRemove = () =>{
    document.getElementById('iconText').classList.add('display');
  }


  render() {

    return (
        <div>
          <div id="iconMenu" className="container-fluid">
            <div className="row">
              <div className="col-3" onMouseEnter={() => this.iconText(this.state.menu)} onMouseLeave={() => this.iconTextRemove()} onClick={() => this.openMenu()}>
                <FontAwesomeIcon icon="home" />
               </div>
               <div className="col-3" onMouseEnter={() => this.iconText(this.state.recherche)} onMouseLeave={() => this.iconTextRemove()} onClick={() => this.openSearch()}>
                 <FontAwesomeIcon icon="search" />
                </div>
               <div className="col-3" onMouseEnter={() => this.iconText(this.state.creer)} onMouseLeave={() => this.iconTextRemove()} onClick={() => this.openEdit()}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </div>
               <div className="col-3" onMouseEnter={() => this.iconText(this.state.logOut)} onMouseLeave={() => this.iconTextRemove()} onClick={() => this.props.signOut()}>
                 <FontAwesomeIcon icon="sign-out-alt"/>
               </div>
              </div>
            </div>
            <div className="container-fluid">
              <div id="iconText" className="row justify-content-center display">

              </div>
            </div>


        <div id="navMenu" onMouseLeave={() => this.navHidden()} className="col-xl-3 col-lg-4 col-md-6 col-sm-8 navMenuLeft">
            <div>
              <h3>Bienvenue {localStorage.getItem("username")}</h3>
            </div>
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              <li className="nav-item" onClick={() => this.navHide()}>
                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-entree" role="tab" aria-controls="pills-profile">Entrées</a>
              </li>
              <li className="nav-item" onClick={() => this.navHide()}>
                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-poisson" role="tab" aria-controls="pills-profile">Poissons</a>
              </li>
              <li className="nav-item" onClick={() => this.navHide()}>
                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-viande" role="tab" aria-controls="pills-profile">Viandes</a>
              </li>
              <li className="nav-item" onClick={() => this.navHide()}>
                <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-dessert" role="tab" aria-controls="pills-profile">Desserts</a>
              </li>
            </ul>
            <div>
              <h2 className="text-muted">You Are The Chief!</h2>
            </div>
          </div>
      </div>

    );
  }
}

export default Menu;
