/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script partie N°1: permet l' affichage du panier client **********************
 ******************* script partie N°2: validation et contrôle des donnees issu du formulaire******************
 **************************************************************************************************************
 **************************************************************************************************************/

 /*************** partie 1****************************************************************************************/

 /******* constante globales    *****/

 const sectionItems = document.getElementById("cart__items");
 /**** declaration des fonctions *****/

 // Requette sur l' API pour obtenir les infos du produit à afficher dans le panier

 function getProductDataFromApi(idValue){

    let tabResult ={
        "prix" : "",
        "urlimg" : "",
        "nom" : ""    
    }
    
    let apiUrl = "http://localhost:3000/api/products/" + idValue;

    fetch(apiUrl)
      // Conversion au format Json des données recues de l' API

      .then(function (res) {
        return res.json();
      })

      // recueration du prix et de l' url de l' image du produit
      .then(function (data) {

         tabResult.prix = data.price;
         tabResult.urlimg = data.imageUrl;
         tabResult.nom = data.name;
      })

      .catch(function (err) {
        alert("il s'est produit une erreur: " + err);
      });

    return tabResult
 }

 // fonction qui recupere les produits du panier dans le local storage

 function getCartInlocalStorage(){

     let cart = JSON.parse(window.localStorage.getItem("product"));
     console.log(localStorage)
     console.log(cart)
     return cart
 }

 

 //Creation de l' élement Article.

 function createElementArticle(id, color){

     let article = document.createElement("article");
     article.setAttribute("class","cart__item");
     article.setAttribute("data-id",id);
     article.setAttribute("data-color",color);
     sectionItems.appendChild(article);
     return article
     
 }

 //ceation de l' élément div conteneur et de l' image du produit

 function createElementDivContainerAndImg(elementArticle, urlImg) {

   let divContainerImg = document.createElement("div");
   divContainerImg.setAttribute("class", "cart__item__img");
   elementArticle.appendChild(divContainerImg);

   let imgProduct = document.createElement("img");
   imgProduct.setAttribute("src", urlImg);
   imgProduct.appendChild(divContainerImg);
  
 }

 // creation de l' element conteneur parent description , parametre 
function createElementDivMainContent(elementArticle){

    let divContainerMainContent  = document.createElement("div");
    divContainerMainContent.setAttribute("class", "cart__item__content");
    elementArticle.appendChild(divContainerMainContent);
    return divContainerMainContent
}

//creation de l' element conteneur description

function createElementDivContainerDescription(
  divContainerMainContent,
  productName,
  productColor,
  productPrice
) {
  let divContainerDescription = document.createElement("div");
  divContainerImg.setAttribute("class", "cart__item__content__description");
  divContainerMainContent.appenchild(divContainerDescription);

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
  divContainerMainContent.appenchild(divContainerSetting);
  return divContainerSetting
}

// creation de l' élément conteneur parametre quantité 

function createElementDivContainerSetQty(divContainerSetting){

    let divContainerSetQty = document.createElement("div");
    divContainerSetQty.setAttribute("class", "cart__item__content__settings__quantity");
    divContainerSetting.appenchild(divContainerSetQty);

    let pQty = document.createElement("p");
    divContainerSetQty.appenchild(pQty);
    pQty.innerText("Qté : ");

    let inputSetQty = document.createElement("input");
    inputSetQty.setAttribute("type", "number");
    inputSetQty.setAttribute("class", "itemQuantity");
    inputSetQty.setAttribute("name", "itemQuantity");
    inputSetQty.setAttribute("min", "1");
    inputSetQty.setAttribute("max", "100");
    inputSetQty.setAttribute("value", "1");
    divContainerSetQty.appendChild(inputSetQty);
}

// creation de l' élément conteneur parametre suppression

function createElementDivContainerSetDelete(divContainerSetting) {

  let divContainerSetDelete = document.createElement("div");
  divContainerSetDelete.setAttribute(
    "class",
    "cart__item__content__settings__delete"
  );
  divContainerSetting.appenchild(divContainerSetDelete);

  let deleteItem = document.createElement("p");
  deleteItem.setAttribute("class", "deleteItem");
  deleteItem.innerText = "Supprimer";
  divContainerSetDelete.appenchild(deleteItem);
}


//fonction  permettant d' afficher un produit et ses infos correspondante dans le DOM

function displayOneItemInCart(pId,pColor,pUrl,pName,pPrice){

    let productId = pId;
    let productColor = pColor;
    let productUrlImg = pUrl;
    let productName = pName;
    let productPrice = pPrice;

    let article = createElementArticle(productId, productColor);
    createElementDivContainerAndImg(article, productUrlImg);
    let mainContent = createElementDivMainContent(article);
    createElementDivContainerDescription(
      mainContent,  
      productName,
      productColor,
      productPrice
    );
    let containerSetting = createElementDivContainerSetting(mainContent);
    createElementDivContainerSetQty(containerSetting);
    createElementDivContainerSetDelete(containerSetting);


}

//fonction global qui affiche le contenu du panier

function displayCart(){

    //recupere le panier contenu dans le local storage
    let cart = getCartInlocalStorage();

    
    for (let product of cart){
        
        //recupere l' Id du produit, la couleur, la quantité dans le panier
        let productId = product.id;
        let productColor = product.color;
        let productQty = product.qty;
        
        //recupere le prix , l' url de l' image et le nom du produit sur l' api
        let tabResult = getProductDataFromApi(productId);

        //affiche les informations du produit dans le DOM
        displayOneItemInCart(productId, productColor, tabResult.urlimg, tabResult.nom, tabResult.prix);

    }


}


/*************************************************************************************************************
 * *************** code principal pour partie 1 ************************************************************/
 /********************************************************************************************************* */

 displayCart();









