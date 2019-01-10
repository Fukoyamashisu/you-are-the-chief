import React, {Component} from 'react';
import base from '../base';
import Firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NewPreview extends Component {

  state = {
    download: {}
  }

  componentWillMount() {
    const id = localStorage.getItem("theChief");
    this.ref = base.syncState(`${id}`, {
      context: this,
      state: `${id}`
    })
    const storageRef = Firebase.storage().ref(`preview/${this.props.recette.url}`);
    storageRef.getDownloadURL().then(url => {
      this.setState({download: url})
    });
  }

  recette = () => {
    const currentRecette = this.props.recette;
    const download = this.state.download;
    this.props.currentRecipe(currentRecette, download)
  }
  updateDate = (recette) => {
    const date = new Date();
    let hour, min, updateTime;
    let day = date.getDate() - recette.day;
    if(recette.hour > date.getHours()){
      hour = 23 - recette.hour + date.getHours();
      day -= 1;
    }else{
      hour = date.getHours() - recette.hour;
    }
    if(recette.minute > date.getMinutes()){
      min = 59 - recette.minute + date.getMinutes();
    }else{
      min = date.getMinutes() - recette.minute;
    }
    if(day < 1){
      updateTime = `Last updated ${Math.abs(hour)} h ${Math.abs(min)} min ago`;
    }else{
      updateTime = `Last updated ${Math.abs(day)} j ${Math.abs(hour)} h ${Math.abs(min)} min ago`;
    }
    return updateTime;
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



      <div id="publicCard" className="preview col-xl-3 col-lg-4 col-sm-6">
        <div className="card">
          <img className="card-img-top" src={download} alt={recette.nameRecette}/>
          <div className="card-body">
            <h5 className="card-title">{recette.nameRecette}</h5>
            {recette.auteur !== "" &&
            <h6 className="card-subtitle mb-2 text-muted">De: <span style={{textTransform:"uppercase"}}>{recette.auteur}</span></h6>
            }
          </div>
          <div className="eyeNew" onMouseEnter={e => this.enterTooltip(e)} onMouseLeave={e => this.leaveTooltip(e)} onClick={() => this.recette()}>
            <span className="toolLeft newToolUp"><p>Voir le détail</p></span>
            <button className="btn btn-preview"><FontAwesomeIcon icon="eye" /></button>
          </div>
          <div className="card-footer">
            <small className="text-muted">{this.updateDate(recette)}</small>
          </div>
        </div>
      </div>
      );
  }
}

export default NewPreview;
