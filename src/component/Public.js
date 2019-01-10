import React, {Component} from 'react';
import base from '../base';
import NewPreview from './NewPreview';
import RecipeDetailsPublic from './RecipeDetailsPublic';


class Public extends Component {

  state = {
    recette: {}
  }

  componentWillMount() {
    this.ref = base.syncState(`recette`, {
      context: this,
      state: `recette`
    });

  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
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

    const preview = Object.keys(this.state.recette).reverse().map(key => <NewPreview key={key} recette={this.state.recette[key]} currentRecipe={this.currentRecipe}/>);

    return (<div>

      <div>
        <RecipeDetailsPublic recette={this.state.currentRecette} download={this.state.download} currentRecipe={this.currentRecipe} resetState={this.resetState}/>
      </div>
          <div className="container-fluid">
            <div className="row">
              {preview}
            </div>
          </div>
    </div>);
  }
}

export default Public;
