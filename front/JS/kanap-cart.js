/**************************************************************************************************************
 **************************************************************************************************************
 ***********                       site: Kanap                                                 ****************
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



// Recupere les produits du panier dans le local storage

function getCartInlocalStorage() {
  let cart = JSON.parse(window.localStorage.getItem("product"));
  console.log(localStorage);
  console.log(cart);
  return cart;
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
    deleteItemFromCartInDom(productId, productColor);
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


// Mise à jour des totaux du panier  qte et prix 

function displayTotalPriceAndQuantity(){

 
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

        //affichage des totaux
       divTotalQty.innerText = tabResult.totalqty;
  
       divTotalPrice.innerText = tabResult.totalprice;

       console.log(tabResult)
      }

    }
    else {

      divTotalQty.innerText = 0;

      divTotalPrice.innerText = 0;


    }
 
}

//fonction qui modifie le panier dans le local storage et affiche les nouveaux totaux si on modifie la quantite d' un produit

function upDateCartIfQuantityChange(newqty, productId, productColor) {
  
  // recupere le panier du localstorage dans un tableau
  let cart = getCartInlocalStorage();

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

function deleteItemFromCartInDom(productId, productColor){

  //supression dans le local storage
  let cart = getCartInlocalStorage();

  for (let item of cart){

    if(item.id == productId && item.color == productColor){

      // recupere l^index de l' item a suprimer
      let index = cart.indexOf(item);

      // supprime l' item dans le panier
      cart.splice(index, 1);

      //mise à jour du panier dans le local storage avec l' item supprimer
      window.localStorage.setItem("product", JSON.stringify(cart));

      break
    }
  }

  
  // supression de l' item dans le DOM
  let itemFromDom = document.querySelector("article[data-id='" + productId + "']" + "[data-color='" + productColor + "']");
  itemFromDom.remove();

  //mise a jour et affichage des totaux  prix et qte
  displayTotalPriceAndQuantity();
}

// Fonction principale qui affiche les produits sur la page panier

function displayProductsInCart() {
  

  // récuperation du panier dans le local storage
  let cart = getCartInlocalStorage();
  console.log(cart);
  
  // trie du tableau par id 
  cart.sort(function(a,b){
    return (a.id).localeCompare((b.id)) 
  })
  console.log(cart);

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

        // recueration du prix et de l' url de l' image du produit recu de l' API
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
        .then (function (){
          displayTotalPriceAndQuantity();
        })

        .catch(function (err) {
          alert("il s'est produit une erreur: " + err);
        });
    }

  } else {
    alert("Votre panier est vide !");
  }
}

/*************************************************************************************************************
 * *************** code principal pour partie 1 ************************************************************/
/********************************************************************************************************* */

//fonction global qui affiche le contenu du panier

displayProductsInCart();





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
  const regExAlphabetical = /[^A-Za-z\-_\'.]/g;
  const regExAlphanumeric = /[^A-Za-z0-9\-_\'.]/g;
  const regExEmail = /[^a-z0-9]+[^a-z0-9\-_\'\.]+[^@]{1}[^a-z0-9\.]{3,}[^.]{1}[^a-z\-_\']/g;


// initialisation des differents messages d' erreur
  const errorMsgMiss = "Nombre de caracteres insuffisants ,veuillez remplir le champ";
  const errorMsgWrongAlphabetical = "Ce champ doit comporter uniquement des lettres";
  const errorMsgWrongAlphanumerical =  "Ce champ doit comporter uniquement des caracteres alphanumeriques";
  const errorMsgWrongEmail =  "Ce champ doit comporter une adresse email valide";

// Objet litteral indiquant la validation des inputs

let tabCheckInput = {
  "firstName" : null,
  "lastName" : null,
  "adrress" : null,
  "city" : null,
  "email" : null
}



/**** declaration des fonctions *****/




// determine le regEx en fonction de l' input utilisé
function setRegEx(inputId){

  if (inputId == "firstName" || inputId == "lastName" || inputId == "city") {

    regEx = regExAlphabetical;
    
  } 
  else if (inputId == "address") {
    
    regEx = regExAlphanumeric
    
  } 
  else if (inputId == "email") {
    
    
    regEx = regExEmail
    
  }
  return regEx
}

// determine les messages d' erreur en fonction de l' input utilisée
function setErrorMessage(inputId){

  if (inputId == "firstName" || inputId == "lastName" || inputId == "city") {

    
    errorMessageWrong = errorMsgWrongAlphabetical;
    
  } 
  else if (inputId == "address") {
    
    errorMessageWrong = errorMsgWrongAlphanumerical;
    
  } 
  else if (inputId == "email") {
    
    
    errorMessageWrong = errorMsgWrongEmail;
    
  }
  return errorMessageWrong
}

// determine l' element cible oû sera afficher le message d' erreur
function targetContainerForErrorMessage(inputId){

  let containerErrorMessage;

  switch(inputId){
    
    case "firstName":
       containerErrorMessage =  document.getElementById("firstNameErrorMsg");
      break

    case "lastName":
       containerErrorMessage = document.getElementById("lastNameErrorMsg");
      break

    case "address":
       containerErrorMessage = document.getElementById("addressErrorMsg");
      break

    case "city":
       containerErrorMessage = document.getElementById("cityErrorMsg");
      break

    case "email":
       containerErrorMessage = document.getElementById("emailErrorMsg");
      break

  }

  return containerErrorMessage;
}

// teste la validite d' une input utilisateur 
function checkInputForm(inputValue, inputId){

  let regEx = setRegEx(inputId);
  let errorMessage = setErrorMessage(inputId);
  let containerErrorMessage = targetContainerForErrorMessage(inputId);
  let inputForm = document.getElementById(inputId);

  if (inputValue.match(regEx)) {
    containerErrorMessage.innerText = errorMessage;
    inputForm.style.border = "2px solid red";
    
     tabCheckInput.inputId = false;
     return tabCheckInput.inputId
    

  } 
  else if (inputValue.length < 2) {
    containerErrorMessage.innerText = errorMsgMiss;
    inputForm.style.border = "2px solid red";

   tabCheckInput.inputId = false;
   return tabCheckInput.inputId;


  }
  else {
    containerErrorMessage.innerText = null;
    inputForm.style.border = "2px solid green";
    
    tabCheckInput.inputId = true;
    console.log( tabCheckInput);
    return tabCheckInput.inputId;
    
     
  }

}



// function qui controle formulaire apres click sur bouton commander
function checkValidityOfForm(evt) {
  
  // bloque l' envoi du formulaire
  evt.preventDefault();
  alert("envoi du formulaire bloque");

  console.log(tabCheckInput)
  
  // si aucun message d' erreur n' est trouve dans le dom on valide le formulaire
  if(tabCheckInput.firstName && tabCheckInput.lastName && tabCheckInput.adrress && tabCheckInput.city && tabCheckInput.email){

    // objet contact à envoyer
    let contact = {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value
    };
    
    console.log(typeof inputFirstName.value)

    console.log(contact)

    // tableau de produit-id à envoyer
    let cart = getCartInlocalStorage();
    let products = [];

    for (let item of  cart){
       
      products.push(item.id)
    }

    console.log(products)
      

      let bodyRequest = {
        "contact" : contact,
        "products" : products
      };

      // formatage json pour le fetch post
      let jsonBodyRequest = JSON.stringify(bodyRequest);

    //requette post vers l 'API

    const apiUrl = "http://localhost:3000/api/products/order";

    const setFetch = {
      method: "POST",
      body: jsonBodyRequest,
      headers : {
        "content-Type" : "application/json",
      }
    };

    fetch(apiUrl,setFetch)
    
    .then(function (res) {
      return res.json();
    })

    .then(function(data){

      let idOrder = data.orderId;
      window.location.href = "./confirmation.html?orderId=" + idOrder;
    })

    .catch(function (err) {
          alert("il s'est produit une erreur: " + err);
        });
  }

  else{
    alert("Commande non envoyée, veuillez remplir correctement le formulaire")
  }
  
}
  

inputFirstName.addEventListener("input", function(){ checkInputForm(this.value, this.id)});
inputLastName.addEventListener("input", function(){ checkInputForm(this.value, this.id)});
inputAddress.addEventListener("input", function(){ checkInputForm(this.value, this.id)});
inputCity.addEventListener("input", function(){ checkInputForm(this.value, this.id)});
inputEmail.addEventListener("input", function(){ checkInputForm(this.value, this.id)});

buttonOrder.addEventListener("click",  checkValidityOfForm );