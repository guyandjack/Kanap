/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des infos produits sur la page produit**********************
 **************************************************************************************************************
 **************************************************************************************************************/

//******  constantes globales ********

const apiUrl = "http://localhost:3000/api/products";


/****** constantes liées au DOM ***** */

const containerImg = document.querySelector(".item__img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");


/***** declaration des fonctions ****** */

// permet de recuperer l'id du produit dans l' url 

function getDataUrl(){

    try{
        let url = window.location.href;
        let urlValue = new URL(url);
        idValue = urlValue.searchParams.get("id");
              
        return idValue
    }
    catch(e){

        return e.code;

    }
}




//crée un élément html "img" avec attribut src et alt dans l' élément "div class=items__img"

 function createImg(arg){

    newImg = document.createElement("img");
    newImg.setAttribute("alt", "Photographie d'un canapé");
    newImg.setAttribute("src", arg);
    containerImg.appendChild(newImg);

}

// Implémente les données dans les éléments du DOM

function pushData(name,price,desc){

    
    productName.innerText = name;
    productPrice.innerText = price;
    productDescription.innerText = desc;
    
   
}

// Fonction principale qui regroupe l' ensemble des fonctions permetant  l' affichage des données correspondant a un produit

function displayDataProductById() {

    // obtient l' id du produit contenu dans l' url de la page courante
    getDataUrl();
  
    // Accession à l' API via son Url

    fetch(apiUrl)

    // Conversion au format Json des données recues de l' API

    .then(function (res) {
      return res.json();
    })

    // extrait l' id des produits de l' API et le compare à l' id de l' url de la page courante

    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        if (idValue == data[i]._id) {
          createImg(data[i].imageUrl);
          pushData(data[i].name, data[i].price, data[i].description); //implemente les donnees dans le DOM
        }
      }
    })

    // Affichage d' une erreur éventuelle dans une fenetre pop up

    .catch(function (err) {
      alert("il s'est produit une erreur: " + err);
    });
}

/**************** code principal ***********************/

// fonction principale pour la page product

displayDataProductById();