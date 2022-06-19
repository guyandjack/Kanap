/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des infos produits sur la page produit**********************
 **************************************************************************************************************
 **************************************************************************************************************/

/*** constantes liées au DOM ************/
const buttonBucket = document.getElementById("addToCart");

/*** variables de fonctionnement*** */

// contient la valeur du local storage sous forme d' objet
let bucket;

if (window.localStorage.getItem("product") != null) {
  bucket = JSON.parse(window.localStorage.getItem("product"));
} else {
  bucket = [];
}

/***** declaration des fonctions ****** */

// permet de recuperer l'id du produit dans l' url

function getDataUrl() {
  try {
    let url = window.location.href;
    let urlValue = new URL(url);
    idValue = urlValue.searchParams.get("id");

    return idValue;
  } catch (e) {
    return e.code;
  }
}

//crée un élément html "img" avec attribut src et alt dans l' élément "div class=items__img"

function createImg(arg1, arg2) {
  const containerImg = document.querySelector(".item__img");
  newImg = document.createElement("img");
  newImg.setAttribute("src", arg1);
  newImg.setAttribute("alt", arg2);
  containerImg.appendChild(newImg);
}

// Implémente les données (nom, prix, description)  dans les éléments du DOM

function insertDataText(name, price, desc) {
  const productName = document.getElementById("title");
  const productPrice = document.getElementById("price");
  const productDescription = document.getElementById("description");

  productName.innerText = name;
  productPrice.innerText = price;
  productDescription.innerText = desc;
}

// Crée les element option dans le DOM  permetant le choix de la couleur par l' utilisateur

function createOption(arg) {
  const select = document.getElementById("colors");

  for (color of arg) {
    newOption = document.createElement("option");
    newOption.setAttribute("value", color);
    newOption.innerText = color;
    select.appendChild(newOption);
  }
}

// Fonction principale qui regroupe l' ensemble des fonctions permetant l' affichage des données correspondant au produit selectionné sur page accueil

function displayDataProductById() {
  // obtient l' id du produit contenu dans l' url de la page courante
  getDataUrl();

  // Requette sur l' API pour obtenir le produit seletionné
  let apiUrl = "http://localhost:3000/api/products/" + idValue;
  fetch(apiUrl)
    // Conversion au format Json des données recues de l' API

    .then(function (res) {
      return res.json();
    })

    //implemente les donnees du produit selectionné dans le DOM
    .then(function (data) {
      createImg(data.imageUrl, data.altTxt);
      insertDataText(data.name, data.price, data.description);
      createOption(data.colors);
    })

    // Affichage d' une erreur éventuelle dans une fenetre pop up

    .catch(function (err) {
      alert("il s'est produit une erreur: " + err);
    });
}

// Stokage des informations du produit suite à un click sur le bouton "ajouter au panier"

// recupere la quantite defini par l' utilisateur
function getQuantity() {
  const qtyProducts = document.getElementById("quantity");
  let qtyProductsValue = parseInt(qtyProducts.value);
  return qtyProductsValue;
}

// recupere la couleur defini par l' utilisateur
function getColor() {
  const colorProduct = document.getElementById("colors");
  let colorProductValue = colorProduct.value;
  return colorProductValue;
}

//enregistre les données du panier dans le local storage
function saveBucketInLocalStorage(arg) {
  window.localStorage.setItem("product", JSON.stringify(arg));
}

//Verifie si le nouveau produit existe deja
function checkNewProductIfAlreadyExist(newProduct, actualBucket) {
  let exist = {
    "ifexist": false,
    "newqty": 0,
    "indexitemexist": null
  };

  for (let i = 0; i < actualBucket.length; i++) {
    if (
      newProduct.id == actualBucket[i].id &&
      newProduct.color == actualBucket[i].color
    ) {
      // Si le produit existe deja dans le panier actuel:
      // un booelen passe true, recupere la qte du nouveau produit, recupere l' indexe du produit concerné dans le panier actuel

      exist = {

        "ifexist" : true,
        "newqty" : newProduct.qty,
        "indexitemexist" : i
      };
      break;
    }
  }

  return exist;
}

// enrgistre les produits, la qte, la couleur dans le panier
function pushToBucket() {
  // recupere la qte et la couleur choisi par l' utilisateur
  let qty = getQuantity();
  let color = getColor();

  // nouveau produit
  let valueToPushInBucket = {
    "id": idValue,
    "qty": qty,
    "color": color
  };

  console.log(bucket);
  console.log(valueToPushInBucket);

  // verifie si le produit existe deja dans le panier
  let check = checkNewProductIfAlreadyExist(valueToPushInBucket, bucket);
  console.log(check);

  // si le nouveau produit n' existe pas on le rajoute au panier
  if (check.ifexist == false) {
    bucket.push(valueToPushInBucket);
  }
  // si il existe on modifie la quqntite correspondant au produit du pannier existant
  else {
    bucket[check.indexitemexist].qty += check.newqty;
  }
  console.log(bucket);
  
  // trie du panier en fonction des models et des couleurs
  bucket.sort((a,b) => a.id + b.id );
  
  
  console.log(bucket);


  saveBucketInLocalStorage(bucket);

  //redirection vers page panier
  /*window.location.href =
    "file:///D:/Cours%20informatique/openclassroom/Formation/projet-5-JS/P5-Dev-Web-Kanap/front/html/cart.html";*/
}

/**************** code principal  ***********************/

// fonction principale pour la page product

displayDataProductById();
buttonBucket.addEventListener("click", pushToBucket);
