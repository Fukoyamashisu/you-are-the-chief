import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import base from '../base';
import Firebase from 'firebase';
import marked from 'marked';


class Edit extends Component {

  state = {
    text: "",
    ingredients: "",
    }
  componentWillMount() {
    this.ref = base.syncState(`public`, {
      context: this,
      state: `public`
    })
  }
  preview = (event) => {
    let file;
    if(event === undefined){
      file = document.getElementById('editFile').files[0];
    }else{
      file = event.dataTransfer.files[0];
    }
    const preview = document.getElementById('editImage');
    if(preview.hasChildNodes()){
      preview.removeChild(preview.firstChild);
    }
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.addEventListener("load", function() {
        const image = new Image();
        image.height = 140;
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

  modifRecette = (event, modifPreview) => {
    event.preventDefault();
    const uploadProgress = document.getElementById('uploadProgress');
    uploadProgress.style.top = `${window.pageYOffset}px`;
    uploadProgress.style.display = "block";
    const recette = this.props.recette;
    const globalState = {...this.state};
    const file = this.state.file;
    const recetteDatabase = {
      nameRecette: this.recetteName.value,
      cookTime: this.recetteCookTime.value,
      time: this.recetteTime.value,
      timeOff: this.recetteTimeOff.value,
      ingredient: this.recetteIngredients.value,
      description: this.recetteDescription.value,
      category: recette.category,
      personNumber: this.recettePerson.value,
      auteur: recette.auteur,
      month: recette.month,
      day: recette.day,
      hour: recette.hour,
      minute: recette.minute,
      url: recette.url,
      temp: recette.temp
    }
    if (file !== undefined) {
      const recetteStorage = {
        nameRecette: this.recetteName.value,
        cookTime: this.recetteCookTime.value,
        time: this.recetteTime.value,
        timeOff: this.recetteTimeOff.value,
        ingredient: this.recetteIngredients.value,
        description: this.recetteDescription.value,
        category: recette.category,
        personNumber: this.recettePerson.value,
        auteur: recette.auteur,
        month: recette.month,
        day: recette.day,
        hour: recette.hour,
        minute: recette.minute,
        url: `${recette.temp}/${file.name}`,
        temp: recette.temp
      }
      //update Database
      this.props.modifRecette(recette, recetteStorage);
      //DELETE STORAGE
      const deleteImage = Firebase.storage().ref().child(`image/${recette.url}`);
      deleteImage.delete();
      //update Storage
      const userImage = Firebase.storage().ref().child(`image/${recette.temp}/${file.name}`);
      let uploadTask = userImage.put(file);
      uploadTask.on('state_changed', function(snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const uploadProgress = document.getElementById('uploadProgress');
        const percentage = uploadProgress.getElementsByTagName('h3');
        const info = uploadProgress.getElementsByTagName('h1');
        const progressBar = document.getElementById('uploadBar');
        progressBar.style.width = `${progress}%`;
        percentage[0].innerHTML = 'Mise à jour à ' + Math.round(progress) + '% effectué';
        switch (snapshot.state) {
          case Firebase.storage.TaskState.PAUSED: // or 'paused'
            info[0].innerHTML = 'En attente';
            break;
          case Firebase.storage.TaskState.RUNNING: // or 'running'
            info[0].innerHTML = 'Mise à jour en cours';
            break;
          default:
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
        document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Erreur de Mise à jour !";
      }, function() {
        setTimeout(() => {
        if (globalState["public"][`recette-${recette.temp}`] !== undefined) {
          //update public database
          modifPreview(recette, recetteStorage);
          //delete public storage
          const storage = Firebase.storage().ref().child(`preview/${recette.url}`);
          storage.delete();
          //Upload public storage
          const publicImage = Firebase.storage().ref().child(`preview/${recette.temp}/${file.name}`);
          let uploadTask = publicImage.put(file);
          uploadTask.on('state_changed', function(snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const uploadProgress = document.getElementById('uploadProgress');
            const percentage = uploadProgress.getElementsByTagName('h3');
            const info = uploadProgress.getElementsByTagName('h1');
            const progressBar = document.getElementById('uploadBar');
            progressBar.style.width = `${progress}%`;
            percentage[0].innerHTML = 'Mise à jour à ' + Math.round(progress) + '% effectué';
            switch (snapshot.state) {
              case Firebase.storage.TaskState.PAUSED: // or 'paused'
                info[0].innerHTML = 'En attente';
                break;
              case Firebase.storage.TaskState.RUNNING: // or 'running'
                info[0].innerHTML = 'Mise à jour en cours';
                break;
              default:
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
            document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Erreur de Mise à jour !";
          }, function() {
            document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Mise à jour réussi !";
            //rafraichissement
            setTimeout(() => {
              window.location.reload(true);
            }, 1500)
          });
        }else{
          setTimeout(() => {
            window.location.reload(true);
          }, 500)
        }
       },1000);
      });

    } else {
      this.props.modifRecette(recette, recetteDatabase);
      document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Mise à jour réussi !";
      document.getElementById('uploadProgress').getElementsByTagName('h3')[0].innerHTML = 'Mise à jour à 100% effectué';
      document.getElementById('uploadBar').style.width="100%";
      setTimeout(() => {
        window.location.reload(true);
      }, 800)
    }
  }


  closeWindow = (event) => {
    event.preventDefault();
    const download = undefined;
    this.props.resetState(download);
    document.getElementById('recipeDetails').classList.remove('display');
    document.getElementById('edit').classList.add('display');
    document.getElementById("recipe").classList.remove('slide');
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


  render() {

    const recette = this.props.recette;
    const download = this.props.download;


    return (
      <div id="edit" className="container-fluid display">
        {download !== undefined &&
           <div className="row">
             <div className="col">
             <form className="formControl" ref={input => this.recetteForm = input}>
               <div className="form-row  marginUp">
                <div className="col-4 offset-2">
                  <div className="form-group" style={{textAlign:"left"}}>
                   <button className="btn btn-outline-light" onClick={(e) => this.closeWindow(e)}><FontAwesomeIcon icon="times"/></button>
                  </div>
                </div>
                 <div className="col-4" style={{textAlign:"right"}}>
                  <div className="form-group">
                    <button className="btn btn-outline-light btn-lg" onClick={(e) => this.modifRecette(e, this.props.modifPreview)}>Sauvegarder</button>
                 </div>
                </div>
               </div>
                <div className="form-row">
                  <div className="col-md-4 offset-md-2">
                    <div className="form-group">
                      <label htmlFor="editName">Nom de la recette</label>
                      <input type="text" className="form-control" id="editName" defaultValue={recette.nameRecette} ref={input => this.recetteName = input}/>
                    </div>
                    <div className="form-row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="editTime"><FontAwesomeIcon icon="clock"/>
                            Préparation</label>
                          <input type="text" className="form-control" id="editTime" defaultValue={recette.time} ref={input => this.recetteTime = input}/>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="editTimeCook"><FontAwesomeIcon icon="clock"/>
                            Cuisson</label>
                          <input type="text" className="form-control" id="editTimeCook" defaultValue={recette.cookTime} ref={input => this.recetteCookTime = input}/>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="editTimeOff"><FontAwesomeIcon icon="clock"/>
                            Repos</label>
                          <input type="text" className="form-control" id="editTimeOff" defaultValue={recette.timeOff} ref={input => this.recetteTimeOff = input}/>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="editCategory">Catégorie</label>
                          <input type="text" className="form-control" id="editCategory" defaultValue={recette.category} readOnly="readOnly"/>
                        </div>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="auteur">Auteur</label>
                          <input type="text" className="form-control" id="auteur" defaultValue={recette.auteur} readOnly="readOnly"/>
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
                  <div className="col-md-4">
                    <div className="form-group ddrop">
                        <label htmlFor="editFile">
                          Sélectionnez votre  <FontAwesomeIcon icon="file-image"/>
                        </label>
                        <input id="editFile" type="file" onChange={() => this.preview()}/>
                        <div className="drop" onDragOver={e => this.handleDragOver(e)} onDrop={e => this.handleDrop(e)}>
                        <span className="text-muted" style={{
                            fontWeight: "normal"
                          }}>ou déposez votre image ici.</span>
                        <div id="editImage"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-4 offset-md-2">
                    <div className="form-group">
                      <label htmlFor="editIngredient">Ingrédients</label>
                      <textarea className="form-control" style={{fontFamily: "arial"}} id="editIngredient" rows="14" ref={input => this.recetteIngredients = input} onChange={(e) => this.editIngredient(e)} defaultValue={recette.ingredient} ></textarea>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="marked">Prévisualisation</label>
                      <div id="marked" className="marked" style={{textAlign: "left"}} dangerouslySetInnerHTML={this.renderText(this.state.ingredients)}></div>
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-md-4 offset-md-2">
                    <div className="form-group">
                      <label htmlFor="editDescription">Instructions</label>
                      <textarea className="form-control" style={{fontFamily: "arial"}} id="editDescription" rows="35" ref={input => this.recetteDescription = input} onChange={(e) => this.editText(e)} defaultValue={recette.description}></textarea>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="mark">Prévisualisation</label>
                      <div id="mark" className="marked" style={{textAlign: "left"}} dangerouslySetInnerHTML={this.renderText(this.state.text)}></div>
                    </div>
                  </div>
                </div>
            </form>
          </div>
        </div>
      }
    </div>
    )
  }
}

export default Edit;
