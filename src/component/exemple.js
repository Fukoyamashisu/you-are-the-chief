modifRecette = (event) => {
  event.preventDefault();
  const uploadProgress = document.getElementById('uploadProgress');
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
        //delete public database
        this.props.modifPreview(recette, recetteStorage);
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
          }, 1000)
        });
      },1000);
      }else{
        setTimeout(() => {
          window.location.reload(true);
        }, 800)
      }
    });

  } else {
    this.props.modifRecette(recette, recetteDatabase);
    document.getElementById('uploadProgress').getElementsByTagName('h1')[0].innerHTML = "Mise à jour réussi !";
    document.getElementById('uploadProgress').getElementsByTagName('h3')[0].innerHTML = 'Mise à jour à 100% effectué';
    document.getElementById('uploadBar').style.width="100%";
    setTimeout(() => {
      window.location.reload(true);
    }, 1500)
  }
}
