import React, {Component} from 'react';
import base from '../base';
import PublicPreview from './PublicPreview';
import RecipeDetailsPublic from './RecipeDetailsPublic';

class Search extends Component {

  state = {
    recette: {}
  }

  componentWillMount() {
    this.ref = base.syncState(`public`, {
      context: this,
      state: `recette`
    });
    const id = localStorage.getItem('theChief');
    this.ref = base.syncState(`${id}`, {
      context: this,
      state: `id`
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  search = (e, recetteName) => {

    const filter = e.target.value.toUpperCase();
    const card = document.getElementsByClassName('publicCard');
    for (let i = 0; i < recetteName.length; i++) {
      if (recetteName[i].toUpperCase().indexOf(filter) > -1) {
        card[i].style.display = "block";
      } else {
        card[i].style.display = "none";
      }
      if (e.target.value === "") {
        for (let i = 0; i < recetteName.length; i++) {
          card[i].style.display = "none";
        }
      }
    }
  }

  currentRecipe = (currentRecette, download) => {
    this.setState({currentRecette});
    this.setState({download})
  }

  resetState = (download, currentRecipe) => {
    this.setState({download});
    this.setState({currentRecipe});
  }


  render() {

    let recetteName = [];
    Object.values(this.state.recette).map(element => {
      return recetteName.push(element.nameRecette);
    });

    const preview = Object.keys(this.state.recette).map(key => <PublicPreview key={key} recette={this.state.recette[key]} category={this.state.recette[key]["category"]} id={key} currentRecipe={this.currentRecipe} />)

    return (<div >
      <div id="searchRecette" className="container-fluid">
        <input id="searchInput" type="search" className="form-control mr-sm-2" placeholder="Recherche ta recette" aria-label="Search" onKeyUp={e => this.search(e, recetteName)}/>
      </div>
      <div className="container-fluid">
        <RecipeDetailsPublic recette={this.state.currentRecette} download={this.state.download} currentRecipe={this.currentRecipe} resetState={this.resetState}/>
      </div>
      <div id="find" className="container-fluid">
        <div className="row">
          {preview}
        </div>
      </div>
    </div>);
  }
}

export default Search;
