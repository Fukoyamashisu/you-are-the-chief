import React, {Component} from 'react';
import base from '../base';
import Firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class PublicPreview extends Component {

  state = {
    download: {},
    show:false
  }

  componentWillMount(){
      const id = localStorage.getItem('theChief');
      this.ref = base.syncState(`${id}/`, {
        context: this,
        state: `${id}`
      });
      this.ref = base.syncState(`${id}/${this.props.category}/${this.props.id}`, {
        context: this,
        state: `recette`
      });
      const storageRef = Firebase.storage().ref(`image/${this.props.recette.url}`);
      storageRef.getDownloadURL().then(url => {
        this.setState({download:url})
      });
  }

  ajouterRecette = () => {
    const userState = {...this.state};
    const recette = this.props.recette;
    const id = localStorage.getItem("theChief");
    if(userState[`${id}`][`${recette.category}`] !== undefined){
      if(userState[`${id}`][`${recette.category}`][`recette-${recette.temp}`] === undefined){
        userState[`${id}`][`${recette.category}`][`recette-${recette.temp}`]=recette;
        this.setState(userState);
      }else{
        return;
      }
    }else{
      Firebase.database().ref(`${id}/${recette.category}`).set({
          [`recette-${recette.temp}`]:recette
      })
    }
    this.addInfo();
  }

  addInfo = () => {
    document.getElementById('addInfo').style.display="block";
    setTimeout(() => {document.getElementById('addInfo').style.display="none";},1000 );
  }

  recette = () => {
    const currentRecette = this.props.recette;
    const download = this.state.download;
    this.props.currentRecipe(currentRecette, download)
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
    const userId = this.state.recette;


    return (


      <div className="preview col-xl-3 col-lg-4 col-sm-6 publicCard">
        {(recette.auteur !== localStorage.getItem("theChiefPseudo")) &&
        <div className="card">
          <img className="card-img-top" src={download} alt={recette.nameRecette}/>
          <div className="card-body">
            <h5 className="card-title">{recette.nameRecette}</h5>
            {recette.auteur !== "" &&
            <h6 className="card-subtitle mb-2 text-muted">De: <span style={{textTransform:"uppercase"}}>{recette.auteur}</span></h6>
            }
          </div>
          <div className="eye" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)} onClick={() => this.recette()}>
            <span className="toolLeft"><p>Voir le détail</p></span>
            <button className="btn btn-preview"><FontAwesomeIcon icon="eye" /></button>
          </div>
          {userId !== undefined &&
            userId.nameRecette !== recette.nameRecette &&
            <div className="plus" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)} onClick={() => this.ajouterRecette()}>
              <span className="toolRight"><p>Ajouter</p></span>
              <button className="btn btn-preview"><FontAwesomeIcon icon="plus" /></button>
            </div>
          }
          {userId !== undefined &&
            userId.nameRecette === recette.nameRecette &&
            <div className="addOk" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)}>
              <span className="toolRight"><p>Déja Ajouté</p></span>
              <button className="btn btn-preview"><FontAwesomeIcon icon="check" /></button>
            </div>
          }
        </div>
        }
      </div>
      );
  }
}

export default PublicPreview;
