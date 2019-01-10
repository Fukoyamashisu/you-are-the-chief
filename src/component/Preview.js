import React, {Component} from 'react';
import Firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Preview extends Component {

  state={
    download:{}
  }
  componentWillMount(){
      const storageRef = Firebase.storage().ref(`image/${this.props.recette.url}`);
      storageRef.getDownloadURL().then(url => {
        this.setState({download:url})
      });
  }

  recette = () => {
    const currentRecette = this.props.recette;
    const download = this.state.download;
    this.props.currentRecipe(currentRecette, download);
    document.getElementById("recipe").classList.add('slide');
  }

  supprimerRecette = () => {
    const id = localStorage.getItem("theChief");
    const user = localStorage.getItem("theChiefPseudo");
    const userDatabase = Firebase.database().ref(`${id}/${this.props.recette.category}/recette-${this.props.recette.temp}`);
    const publicDatabase = Firebase.database().ref(`public/recette-${this.props.recette.temp}`);
    const previewDatabase = Firebase.database().ref(`recette/recette-${this.props.recette.temp}`);
    const previewStorage = Firebase.storage().ref().child(`preview/${this.props.recette.url}`);
    if(this.props.recette.auteur === user){
      publicDatabase.remove();
      previewDatabase.remove();
      userDatabase.remove();
      previewStorage.delete();
    }else{
      userDatabase.remove();
    }
    this.props.deleteInfo();
  }
  enterTooltip = (event) => {
    const tooltip = event.currentTarget.getElementsByTagName('span');
    tooltip[0].style.display="block";
  }
  leaveTooltip = (event) => {
    const tooltip = event.currentTarget.getElementsByTagName('span');
    tooltip[0].style.display="none";
  }


  render() {
    const recette = this.props.recette;
    const download = this.state.download;



      return (
        <div className="preview col-xl-3 col-lg-4 col-sm-6">
        <div className="card">
          <img className="card-img-top" src={download} alt={recette.nameRecette}/>
          <div className="card-body">
            <h5 className="card-title">{recette.nameRecette}</h5>
            {recette.auteur !== localStorage.getItem("theChiefPseudo") &&
              <h6 className="card-subtitle mb-2 text-muted">De: <span style={{textTransform:"uppercase"}}> {recette.auteur}</span></h6>
            }
            {recette.auteur === localStorage.getItem("theChiefPseudo") &&
              <h6 className="card-subtitle mb-2 text-muted">De: <span style={{textTransform:"uppercase"}}> Moi</span></h6>
            }
          </div>
          <div className="eyeUser" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)} onClick={() => this.recette()}>
            <span className="toolLeft"><p>Voir le détail</p></span>
            <button className="btn btn-preview"><FontAwesomeIcon icon="eye" /></button>
          </div>
          <div className="trash" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)} onClick={() => this.supprimerRecette()}>
            <span className="toolRight"><p>Supprimer</p></span>
            <button className="btn btn-preview"><FontAwesomeIcon icon="trash" /></button>
          </div>
          {recette.auteur !== localStorage.getItem("theChiefPseudo") &&
           <div className="star"><FontAwesomeIcon icon="star" /></div>
          }
        </div>
      </div>);



  }
}

export default Preview;
