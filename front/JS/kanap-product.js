/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap page: product.html            ****************************************************

 ************      script partie n° 1 : Affichage des infos produits sur la page produit         *************
 
 ***********       script partie n° 2 : Validation du pannier et enregidtrement dans le localstorage      ****

 **************************************************************************************************************
 **************************************************************************************************************/

/*****************************************************************************************************************************
 ****************************** script partie n° 1 : Affichage des infos produits sur la page produit***************************
 *******************************************************************************************************************************/

/*** constantes liées au DOM ************/
const buttonCart = document.getElementById("addToCart");

/***** declaration des fonctions ****** */

// permet de recuperer l'id du produit dans l' url de la page

function getIdProductFromUrl() {
  try {
    let url = window.location.href;
    let urlValue = new URL(url);
    idValue = urlValue.searchParams.get("id");

    return idValue;
  } catch (e) {
    alert("erreur impossible de récuperer l' ID produit dans l' url: " + e);
  }
}

//crée un élément html "img" avec attribut src et alt dans l' élément "div class=item__img"

function createImg(urlImg, textAlt) {
  const containerImg = document.querySelector(".item__img");
  newImg = document.createElement("img");
  newImg.setAttribute("src", urlImg);
  newImg.setAttribute("alt", textAlt);
  containerImg.appendChild(newImg);
}

// Implémente les données (nom, prix, description)  dans les éléments du DOM

function displayDataText(name, price, desc) {
  const productName = document.getElementById("title");
  const productPrice = document.getElementById("price");
  const productDescription = document.getElementById("description");

  productName.innerText = name;
  productPrice.innerText = price;
  productDescription.innerText = desc;
}

// Crée les element option dans le DOM  permetant le choix de la couleur par l' utilisateur

function createOption(arrayOfColors) {
  const select = document.getElementById("colors");

  for (color of arrayOfColors) {
    newOption = document.createElement("option");
    newOption.setAttribute("value", color);
    newOption.innerText = color;
    select.appendChild(newOption);
  }
}

// Fonction principale  permetant l' affichage des données correspondant au produit selectionné sur la page accueil

function displayDataProductById() {
  // obtient l' id du produit contenu dans l' url de la page courante
  let idProduct = getIdProductFromUrl();

  // Requette sur l' API pour obtenir le produit seletionné
  let apiUrl = "http://localhost:3000/api/products/" + idProduct;
  fetch(apiUrl)
    // Conversion au format Json des données recues de l' API

    .then(function (res) {
      return res.json();
    })

    //implemente les donnees du produit selectionné dans le DOM
    .then(function (data) {
      createImg(data.imageUrl, data.altTxt);
      displayDataText(data.name, data.price, data.description);
      createOption(data.colors);
    })

    // Affichage d' une erreur éventuelle dans une fenetre pop up

    .catch(function (err) {
      alert("il s'est produit une erreur: " + err);
    });
}

/*****************************************************************************************************************************
 ****************************** script partie n° 2 : Validation du pannier et enregidtrement dans le localstorage  *************
 *******************************************************************************************************************************/



/****   declaration des fonctions ****/

//initialisation du panier
function initCart(){

  // si un produit existe dans le local storage on initialise le panier actuel avec la valeur du local storage 

  if (window.localStorage.getItem("product") != null) {
    let actualCart = JSON.parse(window.localStorage.getItem("product"));
    return actualCart
  } 

  //si le local storage est vide on initialise le panier avec un tableau vide
  else {
    let actualCart = [];
    return actualCart
  }
}

// recupere la quantite defini par l' utilisateur
function getQuantity() {
  const qtyProducts = document.getElementById("quantity");
  let qtyProductsValue = parseInt(qtyProducts.value);
  return qtyProductsValue;
}

// Controle si la quantite entree par l' utilisateur est valide (positive)
function checkIfQuantityIsValid(qty){
  
  let inputQty = document.querySelector("input[name='itemQuantity']");

  if (qty < 1) {

    alert("Veuillez entrer une quantite strictement superieur à 0");
    inputQty.style.border = "2px solid red";
    

    return -1
  }

  inputQty.style.border = "2px solid transparent";
  return true

}

// recupere la couleur defini par l' utilisateur
function getColor() {
  const colorProduct = document.getElementById("colors");
  let colorProductValue = colorProduct.value;
  return colorProductValue;
}

// controle si une couleur valide a été selectionné par l' utilisateur
  function checkIfColorisSelected(color){
  
  let selectQty = document.getElementById("colors");
  let arrayOfOptionColor = document.querySelectorAll("option");
  console.log(arrayOfOptionColor);

  for (option of arrayOfOptionColor){
   
    if(color == option.innerText){
      selectQty.style.border = "2px solid transparent";
      return true
    }

  }
  alert("veuillez selectionner une couleur dans la liste proposée");
  selectQty.style.border = "2px solid red";
  
  return -1

  }

//enregistre les données du panier dans le local storage
function saveCartInLocalStorage(actualCart) {
  window.localStorage.setItem("product", JSON.stringify(actualCart));
}

//Verifie si le nouveau produit existe deja le panier actuel
function checkNewProductIfAlreadyExist(newProduct, actualCart) {
  

  for (let i in actualCart) {

    if (newProduct.id == actualCart[i].id && newProduct.color == actualCart[i].color) {

      // Si le produit existe deja dans le panier actuel, retourne son indexe

      return parseInt(i);
    }
 
  }
  // Si le produit n'existe pas on retourne -1
  return -1
}

// Enregistre le nouveau produit dans le panier lors du click sur le boutton "ajouter au panier"

function pushToCart() {

  // initialisation du panier
  let actualCart = initCart();
  console.log(actualCart);

  // recupère la qte  ,la couleur choisi par l' utilisateur et l' id du produit
  let qty = getQuantity();

  // controle si la quantite entree par l' utilisateur est valide
  let ifQuantityValid = checkIfQuantityIsValid(qty);
  if (ifQuantityValid == -1){
    return
  }

  let color = getColor();
  console.log(color)

  // controle si une couleur valide a été selectionné par l' utilisateur
  let ifColorValid = checkIfColorisSelected(color);
  if(ifColorValid == -1){
    return
  }
  console.log(ifColorValid)

  let productId = getIdProductFromUrl();

  // nouveau produit à enregister dans le panier
  let newProductToPushInCart = {
    id: productId,
    qty: qty,
    color: color,
  };

  console.log(newProductToPushInCart);

  // Si le panier actuel est vide on ajoute directement le nouveau produit

  if (actualCart.length === 0) {
    actualCart.push(newProductToPushInCart);

  }

  //  le panier actuel contient au moins un produit ,on compare le nouveau produit aux produits existant
  else{
    // retourne l' index du produit deja existant dans le panier actuel
    let productIndexIfExist = checkNewProductIfAlreadyExist(newProductToPushInCart, actualCart );

    // si le nouveau produit n' existe pas deja dans le panier actuel on le rajoute
    if (productIndexIfExist == -1) {
      actualCart.push(newProductToPushInCart);
      
    }

    // si le nouveau produit existe deja dans le panier actuel on modifie la quantite en fonction de l' input utilisateur
    else {
      actualCart[productIndexIfExist].qty = parseInt(qty) + parseInt(actualCart[productIndexIfExist].qty);
    }
  }
  // verifie
  // Enregistrement du panier dans le local storage
  saveCartInLocalStorage(actualCart);

  //redirection vers page panier
  //window.location.href = "./cart.html";
}

// fonction globale pour l' execution du script principal

function runKanapProduct() {

  //initialisatio du panier
  initCart();

  // Affiche dans la page product, le produit selctionné par l' utilisteur .

  displayDataProductById();

  // Enregistre le produit dans le panier lorsque l' utilisteur click sur "ajouter au panier"

  buttonCart.addEventListener("click", pushToCart);
}

/********************************************** script principal  *********************************************/

// execution du script
runKanapProduct();
