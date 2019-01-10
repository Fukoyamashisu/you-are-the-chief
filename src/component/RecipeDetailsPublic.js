import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import marked from 'marked';

class RecipeDetails extends Component {


  closeWindow = () => {
    const download = undefined;
    const currentRecipe = undefined;
    this.props.resetState(download, currentRecipe);
  }

  renderText = (text) => {
  const renderText = marked(text, {sanitize: false});
  return { __html: renderText };
  }


  render() {

    const recette = this.props.recette;
    const download = this.props.download;

    return (
      <div id="recipePublic" className="container-fluid">
         {download !== undefined &&
           <div id="recipeDetails" className="row">
             <div className="col-md-10 offset-md-1">
               <div className="row marginUp">
                 <div className="col-md-4 offset-md-2">
                   <div className="form-group">
                     <button className="btn btn-block" onClick={() => this.closeWindow()}><FontAwesomeIcon icon="times"/> Fermer</button>
                   </div>
                 </div>
               </div>
               <div className="row marginUp">
                 <div className="col-md-4 image">
                   <img src={download} alt={recette.nameRecette}/>
                 </div>
                 <div className="col-md-8 recetteInfo">
                   <div className="row">
                     <div className="col">
                       <h2>{recette.nameRecette}</h2>
                     </div>
                   </div>
                   <div className="row marginUp">
                     <div className="col">
                       <h5><strong>préparation:</strong><br/><FontAwesomeIcon icon="clock"/> {recette.time} min</h5>
                     </div>
                     <div className="col">
                       <h5><strong>cuisson:</strong><br/><FontAwesomeIcon icon="clock"/> {recette.cookTime} min</h5>
                     </div>
                     <div className="col">
                       <h5><strong>repos:</strong><br/><FontAwesomeIcon icon="clock"/>{(recette.timeOff !== "" && recette.timeOff !== "0")&&  recette.timeOff + ` min`}</h5>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="row marginUp">
                 <div className="col-md-4 ingredient">
                   <div>
                     <h3>Ingrédients</h3>
                   </div>
                   <div style={{textAlign:"left"}} dangerouslySetInnerHTML={this.renderText(recette.ingredient)}></div>
                 </div>
                 <div className="col-md-8 recette">
                   <div>
                     <h3>Détails de la recette</h3>
                   </div>
                   <div style={{textAlign:"left"}} dangerouslySetInnerHTML={this.renderText(recette.description)}></div>
                 </div>
               </div>
             </div>
           </div>
        }
      </div>
    )
  }
}

export default RecipeDetails;
