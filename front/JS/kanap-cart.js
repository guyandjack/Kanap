/**************************************************************************************************************
 **************************************************************************************************************
 ***********                       site: Kanap  page: cart.html                               ****************
 ***********          
 *********           script partie N°1: permet l' affichage du panier client                     *************

 *********           script partie N°2: validation et contrôle des donnees issu du formulaire          ******

 **************************************************************************************************************
 **************************************************************************************************************/

/***************************************************************************************************************
/*************** script partie N°1: permet l' affichage du panier client ***************************************
 **************************************************************************************************************/

/******* constante globales    *****
 * *********************************/

const sectionItems = document.getElementById("cart__items");

/**** declaration des fonctions *****
 * **********************************/

//recuperation du panier dans le local storage
function getCartFromLocalStorage() {
  // si un produit existe dans le local storage on initialise le panier actuel avec la valeur du local storage

  if (window.localStorage.getItem("product") != null) {
    let actualCart = JSON.parse(window.localStorage.getItem("product"));
    return actualCart;
  }

  //si le local storage est vide on initialise le panier avec un tableau vide
  else {
    let actualCart = [];
    return actualCart;
  }
}

// Creation de l' élement Article.

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
function createElementDivContent(elementArticle) {
  let divContent = document.createElement("div");
  divContent.setAttribute("class", "cart__item__content");
  elementArticle.appendChild(divContent);
  return divContent;
}

//creation de l' element conteneur description

function createElementDivContainerDescription(
  divContent,
  productName,
  productColor,
  productPrice
) {
  let divContainerDescription = document.createElement("div");
  divContainerDescription.setAttribute(
    "class",
    "cart__item__content__description"
  );
  divContent.appendChild(divContainerDescription);

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

function createElementDivContainerSetting(divContent) {
  let divContainerSetting = document.createElement("div");
  divContainerSetting.setAttribute("class", "cart__item__content__settings");
  divContent.appendChild(divContainerSetting);
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

  inputSetQty.addEventListener("change", function (evt) {
    
    upDateCartIfQuantityChange(this.value, productId, productColor, evt);

   
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
    deleteItemFromCart(productId, productColor);
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

  let mainContent = createElementDivContent(article);

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

// Affichage des totaux du panier  qte et prix

function displayTotalPriceAndQuantity() {
  let tabOfItem = document.querySelectorAll("article.cart__item");
  console.log(tabOfItem);

  let tabResult = {
    totalqty: null,
    totalprice: null,
  };

  let divTotalQty = document.getElementById("totalQuantity");
  let divTotalPrice = document.getElementById("totalPrice");

  if (tabOfItem.length != 0) {
    for (let item of tabOfItem) {
      // recuperation de la qte sur un produit
      let qtyValue = parseFloat(item.querySelector(".itemQuantity").value);

      tabResult.totalqty += qtyValue;

      // recuperation du prix pour un produit
      let priceValue = parseFloat(
        item.querySelector(".cart__item__content__description :nth-child(3)")
          .textContent
      );

      tabResult.totalprice += qtyValue * priceValue;
    }
    //affichage des totaux
    divTotalQty.innerText = tabResult.totalqty;

    divTotalPrice.innerText = tabResult.totalprice;

    console.log(tabResult);
  } else {
    divTotalQty.innerText = 0;

    divTotalPrice.innerText = 0;
  }
}

//fonction qui modifie le panier dans le local storage et affiche les nouveaux totaux si on modifie la quantite d' un produit

function upDateCartIfQuantityChange(newqty, productId, productColor, evt) {
  // Si la quantite entree par l' utilisateur est negative on stop la fonction et affiche message erreur
  if (newqty < 1) {
    alert("Veuillez entrer une quantite superieur à 0");
    evt.target.style.border = "2px solid red";
    evt.target.focus();
    return 
  }

  // recupere le panier du localstorage dans un tableau
  let cart = getCartFromLocalStorage();

  for (let item of cart) {
    if (item.id == productId && item.color == productColor) {
      item.qty = newqty;

      // mise à jours du panier dans le local storage

      window.localStorage.setItem("product", JSON.stringify(cart));

      break;
    }
  }

  // affiche les totaux prix et qte
  displayTotalPriceAndQuantity();
}

// supprime un produit apres un click sur le bouton suprimer

function deleteItemFromCart(productId, productColor) {
  //supression dans le local storage
  let cart = getCartFromLocalStorage();

  for (let i in cart) {
    if (cart[i].id == productId && cart[i].color == productColor) {
      // supprime l' item dans le panier
      cart.splice(i, 1);

      //mise à jour du panier dans le local storage avec l' item supprimé
      window.localStorage.setItem("product", JSON.stringify(cart));

      break;
    }
  }

  // supression de l' item dans le DOM
  let itemFromDom = document.querySelector(
    "article[data-id='" +
      productId +
      "']" +
      "[data-color='" +
      productColor +
      "']"
  );
  itemFromDom.remove();

  //mise à jour et affichage des totaux  prix et qte
  displayTotalPriceAndQuantity();
}

// trie du tableau par id
function sortCart(cart){
  
    cart.sort(function (a, b) {
      return a.id.localeCompare(b.id);
    });
    
  
}

// Fonction principale qui affiche les produits sur la page panier

function displayProductsInCart() {
  // récuperation du panier dans le local storage
  let cart = getCartFromLocalStorage();
  console.log(cart);
  
  if (cart != null) {
    sortCart(cart);
    console.log(cart);
  }
  

  // recuperation des infos produit , et affichage dans le DOM pour chaque produit du panier

  if (cart != null) {
    for (let product of cart) {
      // recuperation des infos du produit contenu dans le panier

      let productId = product.id;
      let productQty = product.qty;
      let productColor = product.color;

      console.log(productQty);

      // recuperation des infos du produit contenu via l' API

      let apiUrl = "http://localhost:3000/api/products/" + productId;

      fetch(apiUrl)
        // Conversion au format Json des données recues de l' API
        .then(function (res) {
          return res.json();
        })

        // recuperation du prix et de l' url de l' image du produit recu de l' API
        .then(function (data) {
          let productPrice = data.price;
          let productImgUrl = data.imageUrl;
          let productName = data.name;

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

        // Misa à jour et affichage des totaux prix et qte
        .then(function () {
          displayTotalPriceAndQuantity();
        })

        .catch(function (err) {
          alert("il s'est produit une erreur: " + err);
        });
    }
  }
}

/******************** script partie N°2: validation et contrôle des donnees issu du formulaire******************/

// variable liees au DOM

const form = document.querySelector(".cart__order__form");

const inputFirstName = document.getElementById("firstName");

const inputLastName = document.getElementById("lastName");

const inputAddress = document.getElementById("address");

const inputCity = document.getElementById("city");

const inputEmail = document.getElementById("email");

const buttonOrder = document.getElementById("order");

// initialisation des expressions regulieres

//contrainte pour Nom, Prenom, Ville => Accepte des valeurs "alphabetique" ainsi que des "'", des "-", des "_" .

const regExAlphabetical =
  /^[A-Za-z_\'\-]+(?:[A-Za-z_\'\-]+\s[A-Za-z_\'\-]*)*$/g;

//contrainte pour Adresse => Accepte uniquement une valeur alphanumerique ainsi que des "'", des "-", des "_" et des 5 espaces.

const regExAlphanumeric =
  /^[A-Za-z0-9_\'\-]+(?:[A-Za-z0-9_\'\-]+\s[A-Za-z0-9_\'\-]*)*$/g;

// contrainte pour Email => Le nom d' utilisateur commence uniquement par une lettre minuscule ou un nombre  , un seul "@", un nom de domaine en minuscule avec un seul point avant l'indicatif

const regExEmail = /^[a-z0-9]+[a-z0-9\-_\'\.]+@[a-z0-9\.]{3,}\.[a-z]{2,}$/g;

// initialisation des differents messages d' erreur
const errorMsgMiss =
  "Nombre de caracteres insuffisants ,veuillez compléter le champs";

const errorMsgWrongAlphabetical =
  "Ce champs peut contenir uniquement des 'lettres', des '_', des '-'";

const errorMsgWrongAlphanumerical =
  "Ce champs peut contenir uniquement des caractères alphanumeriques";

const errorMsgWrongEmail = "Ce champs doit comporter une adresse email valide";

const errorMsgOver = "Ce champ doit comporter 50 carractères maximum";

const errorMsgEmpty = "Elément vide, veuillez remplir le champs";

// Objet litteral indiquant si le contenu des inputs du formulaire est valide

let tabCheckInput = {
  firstName: null,
  lastName: null,
  address: null,
  city: null,
  email: null,
};

/**** declaration des fonctions *****/

// Affiche une alerte et redirige vers la page accueil si le panier est vide
function isCartIsNotEmpty() {
  let cart = getCartFromLocalStorage();
  console.log(cart);

  if (cart.length > 0) {
    return true;
  }

  alert(
    "impossible de passer commande votre panier est vide, redirection vers page accueil"
  );

  window.location.href = "./index.html";

  return false;
}

// determine l' expressions réguliere de contrainte à utiliser en fonction de l' input selectionnèé par l' utilisateur

function setRegEx(inputId) {
  let regEx = null;

  switch (inputId) {
    case "firstName":
    case "lastName":
    case "city":
      regEx = regExAlphabetical;
      break;

    case "address":
      regEx = regExAlphanumeric;
      break;

    case "email":
      regEx = regExEmail;
      break;
  }
  return regEx;
}

// determine le type de  message d' erreur à afficher en fonction de l' input utilisateur selectionnée

function setErrorMessage(inputId) {
  let errorMessage = null;

  switch (inputId) {
    case "firstName":
    case "lastName":
    case "city":
      errorMessage = errorMsgWrongAlphabetical;
      break;

    case "address":
      errorMessage = errorMsgWrongAlphanumerical;
      break;

    case "email":
      errorMessage = errorMsgWrongEmail;
      break;
  }

  return errorMessage;
}

// determine l' element html oû sera afficher le message d' erreur

function targetContainerForErrorMessage(inputId) {
  let containerErrorMessage;

  switch (inputId) {
    case "firstName":
      containerErrorMessage = document.getElementById("firstNameErrorMsg");
      break;

    case "lastName":
      containerErrorMessage = document.getElementById("lastNameErrorMsg");
      break;

    case "address":
      containerErrorMessage = document.getElementById("addressErrorMsg");
      break;

    case "city":
      containerErrorMessage = document.getElementById("cityErrorMsg");
      break;

    case "email":
      containerErrorMessage = document.getElementById("emailErrorMsg");
      break;
  }

  return containerErrorMessage;
}

// teste la validite d' une input utilisateur

function validateInputFromForm(inputValue, inputId) {
  let regEx = setRegEx(inputId);
  let errorMessage = setErrorMessage(inputId);
  let containerErrorMessage = targetContainerForErrorMessage(inputId);
  let inputForm = document.getElementById(inputId);
  let characterNumberMinimum = null;

  switch (regEx) {
    case regExAlphabetical:
      characterNumberMinimum = 2;
      break;

    case regExAlphanumeric:
    case regExEmail:
      characterNumberMinimum = 10;
      break;
  }

  // si l' input utilisateur correspond à la contrainte regEx, et que le nombre de caracteres est compris entre nombre minimum et 50 , on valide l'input.
  if (
    inputValue.match(regEx) &&
    inputValue.length >= characterNumberMinimum &&
    inputValue.length <= 50
  ) {
    containerErrorMessage.innerText = null;
    inputForm.style.border = "2px solid green";

    tabCheckInput[inputId] = true;
    return;
  }

  //si l'input utilisateur correspond à la contrainte regEx et que le nbr de carractere est superieur à 50  on affiche le message d'erreur indiquant que le nbr de carracteres trop grand.
  if (inputValue.match(regEx) && inputValue.length > 50) {
    containerErrorMessage.innerText = errorMsgOver;
    inputForm.style.border = "2px solid red";

    tabCheckInput[inputId] = false;
    return;
  }

  // si l'input utilisateur correspond à la contrainte regEx et que le nbr de carracteres est inférieur à 2, on affiche le message d'erreur indiquant que le nbr de carracteres est insuffisant.
  if (inputValue.match(regEx) && inputValue.length < characterNumberMinimum) {
    containerErrorMessage.innerText = errorMsgMiss;
    inputForm.style.border = "2px solid red";

    tabCheckInput[inputId] = false;
    return;
  }

  // si l' input utilisateur ne correspond pas à la contrainte regEx, et que le nbr de carracteres est non nul on affiche le message d' erreur indiquant que ces carracteres ne sont pas autorisés.
  if (!inputValue.match(regEx) && inputValue.length != 0) {
    containerErrorMessage.innerText = errorMessage;
    inputForm.style.border = "2px solid red";

    tabCheckInput[inputId] = false;
    return;
  }

  // si l' input utilisateur est vide , on affiche un message indiquant que le champs doit etre completé
  if (inputValue.length == 0) {
    containerErrorMessage.innerText = errorMsgEmpty;
    inputForm.style.border = "2px solid red";

    tabCheckInput[inputId] = false;
    return;
  }
}

//  controle du formulaire apres un click sur le bouton commander

function validateForm(evt) {
  // bloque l' envoi du formulaire pour l' execution des fonctions de controle
  evt.preventDefault();

  //verifie si le panier n'est pas vide
  let valid = isCartIsNotEmpty();
  console.log(valid);

  // si valid est different de true, le panier est vide, on sort de la fonction
  if (!valid) {
    return;
  }

  // Si les inputs du formulaire sont valide on procède à la requete fetch vers l'API
  if (
    tabCheckInput.firstName &&
    tabCheckInput.lastName &&
    tabCheckInput.address &&
    tabCheckInput.city &&
    tabCheckInput.email
  ) {
    // objet contact à envoyer vers l' API
    let contact = {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value,
    };

    // tableau de produit-id à envoyer vers l' API

    let cart = getCartFromLocalStorage();
    let products = [];

    for (let item of cart) {
      products.push(item.id);
    }

    console.log(products);

    let bodyRequest = {
      contact: contact,
      products: products,
    };

    // formatage json pour le fetch post
    let jsonBodyRequest = JSON.stringify(bodyRequest);

    //requette post vers l 'API

    const apiUrl = "http://localhost:3000/api/products/order";

    const setFetch = {
      method: "POST",
      body: jsonBodyRequest,
      headers: {
        "content-Type": "application/json",
      },
    };

    fetch(apiUrl, setFetch)
      .then(function (res) {
        return res.json();
      })

      .then(function (data) {
        let idOrder = data.orderId;
        window.location.href = "./confirmation.html?orderId=" + idOrder;
      })

      .catch(function (err) {
        alert("il s'est produit une erreur: " + err);
      });
    return;
  }

  // Autrement on relance un controle des inputs pour déterminer quelles sont celles qui sont en défaut

  // declenche les event des inputs
  const event = new Event("input");
  inputFirstName.dispatchEvent(event);
  inputLastName.dispatchEvent(event);
  inputAddress.dispatchEvent(event);
  inputCity.dispatchEvent(event);
  inputEmail.dispatchEvent(event);

  // Met le focus sur la premiere input mal renseignée
  for (let i in tabCheckInput) {
    if (!tabCheckInput[i]) {
      document.getElementById(i).focus();
      break;
    }
  }
  alert(
    "Commande non envoyée, veuillez remplir correctement tous les champs du formulaire"
  );
  return;
}

// ecouteur d' évènement qui lance les fonctions de controle des inputs du formulaire
function listenerEvents() {
  inputFirstName.addEventListener("input", function () {
    validateInputFromForm(this.value, this.id);
  });
  inputLastName.addEventListener("input", function () {
    validateInputFromForm(this.value, this.id);
  });
  inputAddress.addEventListener("input", function () {
    validateInputFromForm(this.value, this.id);
  });
  inputCity.addEventListener("input", function () {
    validateInputFromForm(this.value, this.id);
  });
  inputEmail.addEventListener("input", function () {
    validateInputFromForm(this.value, this.id);
  });

  buttonOrder.addEventListener("click", validateForm);
}

// function globale pour l' execution du script principal

function runKanapCart() {
  displayProductsInCart();
  listenerEvents();
}

/**************************************** script principal**************************************** */

//Execution du script principal
runKanapCart();
