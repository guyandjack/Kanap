/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script partie N°1: permet l' affichage du panier client *********************************
 ******************* script partie N°2: validation et contrôle des donnees issu du formulaire******************
 **************************************************************************************************************
 **************************************************************************************************************/

/*************** script partie N°1: permet l' affichage du panier client ****************************************

/******* constante globales    *****/

const sectionItems = document.getElementById("cart__items");

/**** declaration des fonctions *****/

// Fonction principale qui affiche les produits sur la page panier

function displayProductsInCart() {
  // variables liees au DOM
  let totalProductContainer = document.getElementById("totalQuantity");
  let totalPriceContainer = document.getElementById("totalPrice");

  // variable contemant les totaux
  let totalQty = 0;
  let totalPrice = 0;

  // recuperation du panier dans le local storage
  let cart = getCartInlocalStorage();
  console.log(cart);

  // recuperation des infos produit , et affichage dans le DOM pour chaque produit du panier

  if (cart != null) {
    for (let product of cart) {
      // recuperation des infos du produit contenu dans le panier

      let productId = product.id;
      let productQty = product.qty;
      let productColor = product.color;

      console.log(productQty);

      // calcul et affichage  du nombre de produit total dans le panier
      totalQty += productQty;
      totalProductContainer.innerText = totalQty;

      // recuperation des infos du produit contenu via l' API

      let apiUrl = "http://localhost:3000/api/products/" + productId;

      fetch(apiUrl)
        // Conversion au format Json des données recues de l' API
        .then(function (res) {
          return res.json();
        })

        // recueration du prix et de l' url de l' image du produit et affichage des produits dans le panier
        .then(function (data) {
          let productPrice = data.price;
          let productImgUrl = data.imageUrl;
          let productName = data.name;

          console.log(productPrice);

          // calcul du prix total du panier
          totalPrice += productQty * productPrice;
          totalPriceContainer.innerText = totalPrice;

          // Affiche un seul produit du panier
          displayOneItemInCart(
            productId,
            productQty,
            productColor,
            productImgUrl,
            productName,
            productPrice
          );
        })

        .catch(function (err) {
          alert("il s'est produit une erreur: " + err);
        });
    }
  } else {
    alert("Votre panier est vide !");
  }
}

// fonction qui recupere les produits du panier dans le local storage

function getCartInlocalStorage() {
  let cart = JSON.parse(window.localStorage.getItem("product"));
  console.log(localStorage);
  console.log(cart);
  return cart;
}

//Creation de l' élement Article.

function createElementArticle(id, color) {
  let article = document.createElement("article");
  article.setAttribute("class", "cart__item");
  article.setAttribute("data-id", id);
  article.setAttribute("data-color", color);
  sectionItems.appendChild(article);
  return article;
}

//ceation de l' élément div conteneur et de l' image du produit

function createElementDivContainerAndImg(elementArticle, urlImg) {
  let divContainerImg = document.createElement("div");
  divContainerImg.setAttribute("class", "cart__item__img");
  elementArticle.appendChild(divContainerImg);

  let imgProduct = document.createElement("img");
  imgProduct.setAttribute("src", urlImg);
  divContainerImg.appendChild(imgProduct);
}

// creation de l' element conteneur parent description , parametre
function createElementDivMainContent(elementArticle) {
  let divContainerMainContent = document.createElement("div");
  divContainerMainContent.setAttribute("class", "cart__item__content");
  elementArticle.appendChild(divContainerMainContent);
  return divContainerMainContent;
}

//creation de l' element conteneur description

function createElementDivContainerDescription(
  divContainerMainContent,
  productName,
  productColor,
  productPrice
) {
  let divContainerDescription = document.createElement("div");
  divContainerDescription.setAttribute(
    "class",
    "cart__item__content__description"
  );
  divContainerMainContent.appendChild(divContainerDescription);

  let pName = document.createElement("p");
  divContainerDescription.appendChild(pName);
  pName.innerText = productName;

  let pColor = document.createElement("p");
  divContainerDescription.appendChild(pColor);
  pColor.innerText = productColor;

  let pPrice = document.createElement("p");
  divContainerDescription.appendChild(pPrice);
  pPrice.innerText = productPrice;
}

//creation de l' element conteneur parametre

function createElementDivContainerSetting(divContainerMainContent) {
  let divContainerSetting = document.createElement("div");
  divContainerSetting.setAttribute("class", "cart__item__content__settings");
  divContainerMainContent.appendChild(divContainerSetting);
  return divContainerSetting;
}

// creation de l' élément conteneur parametre quantité

function createElementDivContainerSetQty(
  divContainerSetting,
  productId,
  productColor,
  productQty
) {
  let divContainerSetQty = document.createElement("div");
  divContainerSetQty.setAttribute(
    "class",
    "cart__item__content__settings__quantity"
  );
  divContainerSetting.appendChild(divContainerSetQty);

  let pQty = document.createElement("p");
  divContainerSetQty.appendChild(pQty);
  pQty.innerText = "Qté : ";

  let inputSetQty = document.createElement("input");
  inputSetQty.setAttribute("type", "number");
  inputSetQty.setAttribute("class", "itemQuantity");
  inputSetQty.setAttribute("name", "itemQuantity");
  inputSetQty.setAttribute("min", "1");
  inputSetQty.setAttribute("max", "100");
  inputSetQty.setAttribute("value", productQty);
  divContainerSetQty.appendChild(inputSetQty);

  inputSetQty.addEventListener("change", function () {
    upDateCartIfQuantityChange(this.value, productId, productColor);
  });
}

// creation de l' élément conteneur parametre suppression

function createElementDivContainerSetDelete(
  divContainerSetting,
  productId,
  productColor
) {
  let divContainerSetDelete = document.createElement("div");
  divContainerSetDelete.setAttribute(
    "class",
    "cart__item__content__settings__delete"
  );
  divContainerSetting.appendChild(divContainerSetDelete);

  let deleteItem = document.createElement("p");
  deleteItem.setAttribute("class", "deleteItem");
  deleteItem.innerText = "Supprimer";
  divContainerSetDelete.appendChild(deleteItem);

  deleteItem.addEventListener("click", function () {
    deleteProductInCart(productId, productColor);
  });
}

//fonction permettant d' afficher un produit et ses infos correspondante dans le DOM

function displayOneItemInCart(
  productId,
  productQty,
  productColor,
  productImgUrl,
  productName,
  productPrice
) {
  let article = createElementArticle(productId, productColor);
  createElementDivContainerAndImg(article, productImgUrl);
  let mainContent = createElementDivMainContent(article);
  createElementDivContainerDescription(
    mainContent,
    productName,
    productColor,
    productPrice
  );
  let containerSetting = createElementDivContainerSetting(mainContent);
  createElementDivContainerSetQty(
    containerSetting,
    productId,
    productColor,
    productQty
  );
  createElementDivContainerSetDelete(containerSetting, productId, productColor);
}

// fonction qui suprime un produit du panier
function deleteProductInCart(productId, productColor) {
  // recupere le panier du localstorage dans un tableau
  let cart = getCartInlocalStorage();

  for (let item of cart) {
    if (item.id == productId && item.color == productColor) {
      // recupere l ' index de l' element qui valide les conditions
      let index = cart.indexOf(item);

      // suprime l' element du panier
      cart.splice(index, 1);

      // mise a jours du panier dans le local storage
      window.localStorage.removeItem("product");
      window.localStorage.setItem("product", JSON.stringify(cart));

      break;
    }
  }
  // recharge la page pour reinitialiser l' affichage du panier
  window.location.reload();
}

//fonction qui modifie le panier si on modifie la quantire d' un produit

function upDateCartIfQuantityChange(newqty, productId, productColor) {
  // recupere le panier du localstorage dans un tableau
  let cart = getCartInlocalStorage();

  for (let item of cart) {

    if (item.id == productId && item.color == productColor) {
      item.qty = newqty;

      // mise a jours du panier dans le local storage
      window.localStorage.removeItem("product");
      window.localStorage.setItem("product", JSON.stringify(cart));

      break;
    }
  }

  // recharge la page pour reinitialiser l' affichage du panier
  window.location.reload();
}

/*************************************************************************************************************
 * *************** code principal pour partie 1 ************************************************************/
/********************************************************************************************************* */

//fonction global qui affiche le contenu du panier

displayProductsInCart();





/******************** script partie N°2: validation et contrôle des donnees issu du formulaire******************/

// variable liees au DOM
const buttonOrder = document.getElementById("order");

const inputFirstName = document.getElementById("firstName");


const inputLastName = document.getElementById("lastName");


const inputAddress = document.getElementById("address");


const inputCity = document.getElementById("city");
const cityContErrorMessage = document.getElementById("cityErrorMsg");

const inputEmail = document.getElementById("email");
const emailContErrorMessage = document.getElementById("emailErrorMsg");


/**** declaration des fonctions *****/


// fonction qui controle l' input firstName

function checkInputFirstName(inputValue){
  
  const regExFirstName = /[^A-Za-z\- ]/g;
  const firstNameContErrorMessage = document.getElementById("firstNameErrorMsg");
  const errorMsgFirstNameMiss = "Veuillez remplir le champ prenom";
  const errorMsgFirstNameWrong = "Ce champ doit comporter uniquement des lettres";

  if (inputValue.match(regExFirstName) ){

    firstNameContErrorMessage.innerText = errorMsgFirstNameWrong;
    return false
  }
  else if (inputValue.length < 2){

    firstNameContErrorMessage.innerText = errorMsgFirstNameMiss;
    return false
  }

  else {
    firstNameContErrorMessage.innerText = null;
    return true
  }

}

// fonction qui controle l' input lastName

function checkInputLastName(inputValue){
  
  const regExFirstName = /[^A-Za-z\- ]/g;
  const lastNameContErrorMessage = document.getElementById("lastNameErrorMsg");
  const errorMsgLastNameMiss = "Veuillez remplir le champ nom";
  const errorMsgLastNameWrong = "Ce champ doit comporter uniquement des lettres";

  if (inputValue.match(regExFirstName)) {

    lastNameContErrorMessage.innerText = errorMsgLastNameWrong;
    return false
  } 
  else if (inputValue.length < 2) {

    lastNameContErrorMessage.innerText = errorMsgLastNameMiss;
    return false
  } 
  else {

    lastNameContErrorMessage.innerText = null;
    return true
  }

}

// fonction qui controle l' input adresse

function checkInputAddress(inputValue){
  
  const regExAddress = /[^A-Za-z\- 0-9]/g;
  const addressContErrorMessage = document.getElementById("addressErrorMsg");
  const errorMsgAddressMiss = "Veuillez remplir le champ adresse";
  const errorMsgAddressWrong = "Ce champ doit comporter uniquement des caracteres alphanumériques";

  if (inputValue.match(regExAddress)) {

    addressContErrorMessage.innerText = errorMsgAddressWrong;
    return false
  } 
  else if (inputValue.length < 10) {

    addressContErrorMessage.innerText = errorMsgAddressMiss;
    return false
  } 
  else {

    addressContErrorMessage.innerText = null;
    return true
  }

}

// fonction qui controle l' input ville

function checkInputCity(inputValue){
  
  const regExCity = /[^A-Za-z\- ]/g;
  const cityContErrorMessage = document.getElementById("cityErrorMsg");
  const errorMsgCityMiss = "Veuillez remplir le champ adresse";
  const errorMsgCityWrong = "Ce champ doit comporter uniquement des caracteres alphanumériques";

  if (inputValue.match(regExCity)) {

    cityContErrorMessage.innerText = errorMsgCityWrong;
    return false
  } 
  else if (inputValue.length < 3) {

    cityContErrorMessage.innerText = errorMsgCityMiss;
    return false
  } 
  else {

    cityContErrorMessage.innerText = null;
    return true
  }

}

// fonction qui controle l' input email

function checkInputEmail(inputValue){
  
  const regExEmail = /[^a-z\- ]+[^a-z0-9\.\-_]*[^@]{1}[^a-z0-9\-_]{2,}\.[^a-z\.\-_]+[^a-z\-_]+/g;
  const emailContErrorMessage = document.getElementById("emailErrorMsg");
  const errorMsgEmailMiss = "Veuillez remplir le champ email";
  const errorMsgEmailWrong = "Le champ email ne peut pas comporter ce type de caractere";

  if (inputValue.match(regExEmail)) {

    emailContErrorMessage.innerText = errorMsgEmailWrong;
    return false;
  } 
  else if (inputValue.length < 10) {

    emailContErrorMessage.innerText = errorMsgEmailMiss;
    return false;
  } 
  else {
    emailContErrorMessage.innerText = null;
    return true;
  }

}

// function qui controle formulaire apres click sur bouton commander
function checkValidityOfForm(){
  
  /*if (!checkInputFirstName || !checkInputLastName || !checkInputAddress || !checkInputCity || !checkInputEmail ){

    alert("envoi du formulaire bloque")
    evt.preventDefaut()
  }*/
  alert("formulaire envoye")
}

inputFirstName.addEventListener("input", function(){ checkInputFirstName(this.value)});
inputLastName.addEventListener("input", function(){ checkInputLastName(this.value)});
inputAddress.addEventListener("input", function(){ checkInputAddress(this.value)});
inputCity.addEventListener("input", function(){ checkInputCity(this.value)});
inputEmail.addEventListener("input", function(){ checkInputEmail(this.value)});

buttonOrder.addEventListener("click", function(){ checkValidityOfForm });