import React, {Component} from 'react';
import base from '../base';
import Firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import marked from 'marked';
import {sampleText} from '../sampleText';
import {ingredient} from '../ingredient';


class CreerRecette extends Component {


  state = {
    text: sampleText,
    ingredients: ingredient,
    public:{},
    recette:{}
  }

  componentWillMount() {
    const id = localStorage.getItem("theChief");
    this.ref = base.syncState(`${id}`, {
      context: this,
      state: `${id}`
    })
    this.ref = base.syncState(`recette`, {
      context: this,
      state: `recette`
    })
    this.ref = base.syncState(`public`, {
      context: this,
      state: `public`
    })
  }

  componentWillUnmount() {
	  base.removeBinding(this.ref);
	}

  preview = (event) => {
    let file;
    if(event === undefined){
      file = document.getElementById('file').files[0];
    }else{
      file = event.dataTransfer.files[0];
    }
    const preview = document.getElementById('newImage');
    if(preview.hasChildNodes()){
      preview.removeChild(preview.firstChild);
    }
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.addEventListener("load", function() {
        const image = new Image();
        image.height = 160;
        image.title = file.name;
        image.src = this.result;
        preview.appendChild(image);

      }, false);
      reader.readAsDataURL(file);
      this.createNewFile(file);
    }
  }

  createNewFile = (file) => {
    const canvas = document.createElement('canvas');
    const reader = new FileReader();
    reader.addEventListener("load", function() {
      const image = new Image();
      image.title = file.name;
      image.src = this.result;
      image.onload = function() {
        let maxWidth = 400,
            maxHeight = 400,
            imageWidth = image.width,
            imageHeight = image.height;


        if (imageWidth > imageHeight) {
          if (imageWidth > maxWidth) {
            imageHeight *= maxWidth / imageWidth;
            imageWidth = maxWidth;
          }
        }
        else {
          if (imageHeight > maxHeight) {
            imageWidth *= maxHeight / imageHeight;
            imageHeight = maxHeight;
          }
        }
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        image.width = imageWidth;
        image.height = imageHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, imageWidth, imageHeight);
        const blob = dataURLToBlob(canvas.toDataURL('image/jpeg',0.5));
        const file = new File([blob], "image",{type: "image/jpeg"});
        update(file);
      }
    })
    const update = (file) =>{
      this.setState({file});
    }
    const dataURLToBlob = (dataURL) => {
      const BASE64_MARKER = ';base64,';
      const parts = dataURL.split(BASE64_MARKER);
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return (new Blob([uInt8Array], {type: contentType}));
    }
    reader.readAsDataURL(file);
  }



  handleDrop = event => {
    event.stopPropagation();
    event.preventDefault();
    this.preview(event);
  }

  handleDragOver = event => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  ajouterRecette = (event, creerRecette, publicPreview) => {
    event.preventDefault();
    const file = this.state.file;
    const uploadProgress = document.getElementById('uploadProgress');
    uploadProgress.style.top = `${window.pageYOffset}px`;
    uploadProgress.style.display = "block";
    const id = Date.now();
    const category = this.recetteCategory.value;
    const date = new Date();
    const recette = {
      nameRecette: this.recetteName.value,
      cookTime: this.recetteCookTime.value,
      time: this.recetteTime.value,
      timeOff: this.recetteTimeOff.value,
      ingredient: this.recetteIngredients.value,
      description: this.recetteDescription.value,
      category: this.recetteCategory.value,
      personNumber: this.recettePerson.value,
      auteur: localStorage.getItem("theChiefPseudo"),
      month: date.getMonth(),
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      date: date,
      url: `${id}/${file.name}`,
      temp: id
    }

    if (file !== undefined) {
      //update Storage
      const userImage = Firebase.storage().ref().child(`image/${id}/${file.name}`);
      const uploadTask = userImage.put(file);
      uploadTask.on('state_changed', function(snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const uploadProgress = document.getElementById('uploadProgress');
        const percentage = uploadProgress.getElementsByTagName('h3');
        const info = uploadProgress.getElementsByTagName('h1');
        const progressBar = document.getElementById('uploadBar');
        progressBar.style.width = `${progress}%`;
        percentage[0].innerHTML = 'Préparation à ' + Math.round(progress) + '% effectué';
        switch (snapshot.state) {
          case Firebase.storage.TaskState.PAUSED:
            info[0].innerHTML = 'En attente';
            break;
          case Firebase.storage.TaskState.RUNNING:
            info[0].innerHTML = 'Création en cours';
            break;
          default:
            break;
        }
      }, function(error) {

        document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Erreur de Mise à jour !";
      }, function() {
        setTimeout(() => {
          const previewImage = Firebase.storage().ref().child(`preview/${id}/${file.name}`);
          const uploadTask = previewImage.put(file);
          uploadTask.on('state_changed', function(snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const uploadProgress = document.getElementById('uploadProgress');
            const percentage = uploadProgress.getElementsByTagName('h3');
            const info = uploadProgress.getElementsByTagName('h1');
            const progressBar = document.getElementById('uploadBar');
            progressBar.style.width = `${progress}%`;
            percentage[0].innerHTML = 'Création à ' + Math.round(progress) + '% effectué';
            switch (snapshot.state) {
              case Firebase.storage.TaskState.PAUSED:
                info[0].innerHTML = 'En attente';
                break;
              case Firebase.storage.TaskState.RUNNING:
                info[0].innerHTML = 'Création en cours';
                break;
              default:
                break;
            }
          }, function(error) {

            document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Erreur de création !";
          }, function() {
            document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Recette ajouté avec succès !";
            //update Database
            setTimeout(() => {
              creerRecette(recette, id, category);
              publicPreview(recette, id);
              window.location.reload(true);
            }, 1500);
        });
      },1000);
    });

  }else{
    return;
  }
}

  closeWindow = (event) => {
    event.preventDefault();
    document.getElementById('creationRecette').classList.toggle('display');
    document.getElementById('creationRecette').classList.toggle('slide');
  }

  editText = (event) => {
    const text = event.target.value;
    this.setState({text});
  }
  editIngredient = (event) => {
    const ingredients = event.target.value;
    this.setState({ingredients});
  }
  renderText = (text) => {
    const renderText = marked(text, {sanitize: false});
    return {__html: renderText};
  }

  creerRecette = (recette, id, category) => {
    const publicState = {...this.state};
    const userState = {...this.state};
    const username = localStorage.getItem("theChief");
    if(userState[`${username}`][`${category}`] !== undefined){
      userState[`${username}`][`${category}`][`recette-${id}`]=recette;
      this.setState(userState);
    }else{
      Firebase.database().ref(`${username}/${category}`).set({
          [`recette-${id}`]:recette
      })
    }
    publicState["public"][`recette-${id}`]=recette;
    this.setState(publicState);
  }

  publicPreview = (recette, id) => {
    const i = 18;
    const preview = {...this.state};
    const array = Object.keys(preview["recette"]);
    if(array.length >= i){
      const value = Object.values(preview["recette"]);
      const url = value[0].url;
      const storage = Firebase.storage().ref().child(`preview/${url}`);
      preview["recette"][`${array[0]}`]=null;
      storage.delete();
    }
    preview["recette"][`recette-${id}`]=recette;
    this.setState(preview);
  }




  render() {

    return (
        <div id="creationRecette" className="container-fluid display">
          <div className="row">
            <div className="col">
            <form className="formControl" ref={input => this.recetteForm = input}>
              <div className="form-row  marginUp">
               <div className="col-4 offset-2">
                 <div className="form-group" style={{textAlign:"left"}}>
                  <button className="btn btn-outline-light" onClick={(e) => this.closeWindow(e)}><FontAwesomeIcon icon="times"/></button>
                 </div>
               </div>
               {(this.state.file !== undefined && this.recetteName.value !=="") &&
                <div className="col-4" style={{textAlign:"right"}}>
                 <div className="form-group">
                   <button className="btn btn-outline-light btn-lg" onClick={(e, update) => this.ajouterRecette(e, this.creerRecette, this.publicPreview)}>Ajouter Recette</button>
                </div>
               </div>
                }
              </div>
               <div className="form-row">
                 <div className="col-lg-4 offset-lg-2">
                   <div className="form-group">
                     <label htmlFor="recipeName">Nom de la recette</label>
                     <input type="text" className="form-control" id="recipeName" ref={input => this.recetteName = input}/>
                   </div>
                   <div className="form-row">
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="recipeTime"><FontAwesomeIcon icon="clock"/>
                           Préparation</label>
                        <div className="input-group">
                         <input type="text" className="form-control" id="recipeTime" ref={input => this.recetteTime = input}/>
                         <div className="input-group-append">
                            <div className="input-group-text">minute</div>
                          </div>
                        </div>
                       </div>
                     </div>
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="recipeTimeCook"><FontAwesomeIcon icon="clock"/>
                           Cuisson</label>
                           <div className="input-group">
                            <input type="text" className="form-control" id="recipeTimeCook" ref={input => this.recetteCookTime = input}/>
                            <div className="input-group-append">
                               <div className="input-group-text">minute</div>
                             </div>
                           </div>
                       </div>
                     </div>
                   </div>
                   <div className="form-row">
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="recipeTimeOff"><FontAwesomeIcon icon="clock"/>
                           Repos</label>
                           <div className="input-group">
                            <input type="text" className="form-control" id="recipeTimeOff" ref={input => this.recetteTimeOff = input}/>
                            <div className="input-group-append">
                               <div className="input-group-text">minute</div>
                             </div>
                           </div>
                       </div>
                     </div>
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="recipeCategory">Catégorie</label>
                         <select className="form-control" id="recipeCategory" ref={input => this.recetteCategory = input}>
                           <option>Entrées</option>
                           <option>Poissons</option>
                           <option>Viandes</option>
                           <option>Desserts</option>
                         </select>
                       </div>
                     </div>
                   </div>
                   <div className="form-row">
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="auteur">Auteur</label>
                         <input type="text" className="form-control" id="auteur" defaultValue={localStorage.getItem("theChiefPseudo")} readOnly="readOnly"/>
                       </div>
                     </div>
                     <div className="col-6">
                       <div className="form-group">
                         <label htmlFor="howManyPerson">Combien de personnes</label>
                         <select className="form-control" id="howManyPerson" ref={input => this.recettePerson = input}>
                           <option>1</option>
                           <option>2</option>
                           <option>3</option>
                           <option>4</option>
                           <option>5</option>
                           <option>6</option>
                           <option>7</option>
                           <option>8</option>
                         </select>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div className="col-lg-4">
                   <div className="form-group ddrop">
                       <label htmlFor="file">
                         Sélectionnez votre  <FontAwesomeIcon icon="file-image"/>
                       </label>
                       <input id="file" type="file" onChange={() => this.preview()}/>
                       <div className="drop" onDragOver={e => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}>
                       <span className="text-muted" style={{
                           fontWeight: "normal"
                         }}>ou déposez votre image ici.</span>
                       <div id="newImage" ></div>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="form-row">
                 <div className="col-lg-4 offset-lg-2">
                   <div className="form-group">
                     <label htmlFor="recipeIngredient">Ingrédients</label>
                     <textarea className="form-control" style={{fontFamily: "arial"}} id="recipeIngredient" defaultValue={this.state.ingredients} rows="14" ref={input => this.recetteIngredients = input} onChange={(e) => this.editIngredient(e)} ></textarea>
                   </div>
                 </div>
                 <div className="col-lg-4">
                   <div className="form-group">
                     <label htmlFor="marked">Prévisualisation</label>
                     <div id="marked" className="marked" style={{textAlign: "left"}} dangerouslySetInnerHTML={this.renderText(this.state.ingredients)}></div>
                   </div>
                 </div>
               </div>
               <div className="form-row">
                 <div className="col-lg-4 offset-lg-2">
                   <div className="form-group">
                     <label htmlFor="recipeDescription">Instructions</label>
                     <textarea className="form-control" style={{fontFamily: "arial"}} id="recipeDescription" defaultValue={this.state.text} rows="35" ref={input => this.recetteDescription = input} onChange={(e) => this.editText(e)}></textarea>
                   </div>
                 </div>
                 <div className="col-lg-4">
                   <div className="form-group">
                     <label htmlFor="mark">Prévisualisation</label>
                     <div id="mark" className="marked" style={{textAlign: "left"}} dangerouslySetInnerHTML={this.renderText(this.state.text)}></div>
                   </div>
                 </div>
               </div>
           </form>
         </div>
       </div>
      </div>

    );
  }
}

export default CreerRecette;
