import React, {Component} from 'react';
import base from '../base';
import Preview from './Preview';
import RecipeDetails from './RecipeDetails';
import CreerRecette from './CreerRecette';
import Search from './Search';
import Firebase from 'firebase';

class Admin extends Component {

  state = {
    Entrées: {},
    Poissons: {},
    Viandes: {},
    Desserts: {}
  }


  componentWillMount() {
    const pseudo = Firebase.database().ref(`${localStorage.getItem("theChief")}/nom`);
    pseudo.on('value', function(snapshot) {
      localStorage.setItem("theChiefPseudo",`${snapshot.val()}`);
    });

    const id= localStorage.getItem("theChief");
    this.ref = base.syncState(`${id}/Desserts`, {
      context: this,
      state: `Desserts`
    });
    this.ref = base.syncState(`${id}/Entrées`, {
      context: this,
      state: `Entrées`
    });
    this.ref = base.syncState(`${id}/Poissons`, {
      context: this,
      state: `Poissons`
    });
    this.ref = base.syncState(`${id}/Viandes`, {
      context: this,
      state: `Viandes`
    });
    this.ref = base.syncState(`public`, {
      context: this,
      state: `public`
    })
    this.ref = base.syncState(`recette`, {
      context: this,
      state: `recette`
    })
  }

  componentDidMount() {
      window.addEventListener('scroll', this.onScroll, false);
    }

  componentWillUnmount() {
    base.removeBinding(this.ref);
    window.removeEventListener('scroll', this.onScroll, false);
  }
  onScroll = () => {
    const search = document.getElementById("searchRecette");
    const navbar = document.getElementById("iconMenu");
    const searchSticky = search.offsetTop;
    const navSticky = navbar.offsetTop;
    if (window.pageYOffset > searchSticky) {
      search.classList.add("stickySearch")
    } else {
      search.classList.remove("stickySearch");
    }
    if (window.pageYOffset > navSticky) {
      navbar.classList.add("sticky")
    } else {
      navbar.classList.remove("sticky");
    }
  }

  modifRecette = (recette, object) => {
    const publicState = {...this.state};
    const userState = {...this.state};
    userState[`${recette.category}`][`recette-${recette.temp}`]=object;
    this.setState(userState);
    publicState["public"][`recette-${recette.temp}`]=object;
    this.setState(publicState);
  }
  modifPreview = (recette, recetteStorage) => {
    const previewState = {...this.state};
    previewState["recette"][`recette-${recette.temp}`]=recetteStorage;
    this.setState(previewState);
  }

  currentRecipe = (currentRecette, download) => {
    this.setState({currentRecette});
    this.setState({download});
  }
  resetState = (download) => {
    this.setState({download});
  }
  deleteInfo = () => {
    document.getElementById('deleteInfo').style.display="block";
    setTimeout(() => {document.getElementById('deleteInfo').style.display="none";},1000 );
  }


  render() {

    const entree = Object.keys(this.state.Entrées).map(key => <Preview key={key} recette={this.state.Entrées[key]} currentRecipe={this.currentRecipe} deleteInfo={this.deleteInfo}/>);

    const dessert = Object.keys(this.state.Desserts).map(key => <Preview key={key} recette={this.state.Desserts[key]} currentRecipe={this.currentRecipe} deleteInfo={this.deleteInfo}/>);

    const viande = Object.keys(this.state.Viandes).map(key => <Preview key={key} recette={this.state.Viandes[key]} currentRecipe={this.currentRecipe} deleteInfo={this.deleteInfo}/>);

    const poisson = Object.keys(this.state.Poissons).map(key => <Preview key={key} recette={this.state.Poissons[key]} currentRecipe={this.currentRecipe} deleteInfo={this.deleteInfo}/>);

    return (<div>
      <div id="deleteInfo">
        <p>Recette Supprimé</p>
      </div>
      <div id="addInfo">
        <p>Recette Ajouté</p>
      </div>
      <div id="uploadProgress" className="container-fluid">
        <div className="row align-items-center  justify-content-center">
          <div className="col-8">
            <h1> </h1>
          </div>
        </div>
        <div className="row align-items-center justify-content-center">
          <div className="col-8">
            <div><h3> </h3></div>
          </div>
        </div>
        <div className="row align-items-center  justify-content-center">
          <div className="col-8">
            <div className="progress" style={{height:"30px"}}>
              <div id="uploadBar" className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
          </div>
        </div>
      </div>
        <CreerRecette id={this.state.temp}/>
      <div id="search" className="display">
        <Search />
      </div>
      <RecipeDetails recette={this.state.currentRecette} download={this.state.download} resetState={this.resetState} modifRecette={this.modifRecette} modifPreview={this.modifPreview}/>
      <div className="tab-content" id="pills-tabContent">
        <div className="tab-pane fade show active" id="pills-entree" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className="container-fluid" style={{textAlign:"center",background:"white"}}>
            <div>
              <h3 style={{textTransform:"capitalize", textDecoration:"underline", margin:"0", padding:"10px", fontWeight:"bold"}}>
                Mes recettes d'entrées
              </h3>
            </div>
          </div>
          {Object.keys(this.state.Entrées).length === 0 &&
          <div className="container-fluid" style={{height:"100%"}}>
            <div className="row align-items-center justify-content center start" style={{height:"100%", width:"100%"}}>
               <div className="col-sm-8 offset-2" style={{textAlign:"center"}}>
                <h3 style={{color:"rgba(255,255,255,0.8)"}}>Créer une recette ou Recherche en une!<br/>Pour Commencer ton livre de recettes!</h3>
              </div>
            </div>
          </div>
          }
          <div className="container-fluid">
            <div className="row">
              {Object.keys(this.state.Entrées).length > 0 &&
              entree
              }
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-dessert" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className="container-fluid" style={{textAlign:"center",background:"white"}}>
            <div>
              <h3 style={{textTransform:"capitalize", textDecoration:"underline", margin:"0", padding:"10px", fontWeight:"bold"}}>
                mes recettes de desserts
              </h3>
            </div>
          </div>
          {Object.keys(this.state.Desserts).length === 0 &&
          <div className="container-fluid" style={{height:"100%"}}>
            <div className="row align-items-center justify-content center start" style={{height:"100%", width:"100%"}}>
               <div className="col-sm-8 offset-2" style={{textAlign:"center"}}>
                <h3 style={{color:"rgba(255,255,255,0.8)"}}>Créer une recette ou Recherche en une!<br/>Pour Commencer ton livre de recettes!</h3>
              </div>
            </div>
          </div>
          }
          <div className="container-fluid">
            <div className="row">
              {Object.keys(this.state.Desserts).length > 0 &&
              dessert
              }
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-viande" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className="container-fluid" style={{textAlign:"center",background:"white"}}>
            <div>
              <h3 style={{textTransform:"capitalize", textDecoration:"underline", margin:"0", padding:"10px", fontWeight:"bold"}}>
                mes recettes autour de la viande
              </h3>
            </div>
          </div>
          {Object.keys(this.state.Viandes).length === 0 &&
          <div className="container-fluid" style={{height:"100%"}}>
            <div className="row align-items-center justify-content center start" style={{height:"100%", width:"100%"}}>
               <div className="col-sm-8 offset-2" style={{textAlign:"center"}}>
                <h3 style={{color:"rgba(255,255,255,0.8)"}}>Créer une recette ou Recherche en une!<br/>Pour Commencer ton livre de recettes!</h3>
              </div>
            </div>
          </div>
          }
          <div className="container-fluid">
            <div className="row">
              {Object.keys(this.state.Viandes).length > 0 &&
              viande
              }
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="pills-poisson" role="tabpanel" aria-labelledby="pills-home-tab">
          <div className="container-fluid" style={{textAlign:"center",background:"white"}}>
            <div>
              <h3 style={{textTransform:"capitalize", textDecoration:"underline", margin:"0", padding:"10px", fontWeight:"bold"}}>
                mes recettes autour du poisson
              </h3>
            </div>
          </div>
          {Object.keys(this.state.Poissons).length === 0 &&
          <div className="container-fluid" style={{height:"100%"}}>
            <div className="row align-items-center justify-content center start" style={{height:"100%", width:"100%"}}>
               <div className="col-sm-8 offset-2" style={{textAlign:"center"}}>
                <h3 style={{color:"rgba(255,255,255,0.8)"}}>Créer une recette ou Recherche en une!<br/>Pour Commencer ton livre de recettes!</h3>
              </div>
            </div>
          </div>
          }
          <div className="container-fluid">
            <div className="row">
              {Object.keys(this.state.Poissons).length > 0 &&
              poisson
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  );
  }
}

export default Admin;
