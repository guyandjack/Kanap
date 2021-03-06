/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap / page: product.html            *********************************

 ************ script partie n° 1 : Affiche le produit et ses informations  ***********************************
 
 ***********  script partie n° 2 : Validation du pannier et enregistrement dans le localstorage      ****

 **************************************************************************************************************
 **************************************************************************************************************/

/*****************************************************************************************************************************
 ****************************** script partie n° 1 : Affiche le produit et ses informations ***************************
 *******************************************************************************************************************************/

/*** constantes liées au DOM ************/
const buttonCart = document.getElementById("addToCart");
const inputSetQty = document.getElementById("quantity");
const inputSetColor = document.getElementById("colors");


/***** declaration des fonctions ****** */

// permet de recuperer l'id du produit dans l' url de la page courante

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

// Affiche les données (nom, prix, description)  dans les éléments du DOM

function displayDataText(name, price, desc) {
  const productName = document.getElementById("title");
  const productPrice = document.getElementById("price");
  const productDescription = document.getElementById("description");

  productName.innerText = name;
  productPrice.innerText = price;
  productDescription.innerText = desc;
}

// Crée les elements "option" dans le DOM, permetant le choix de la couleur par l' utilisateur

function createOption(arrayOfColors) {
  const select = document.getElementById("colors");

  for (color of arrayOfColors) {
    newOption = document.createElement("option");
    newOption.setAttribute("value", color);
    newOption.innerText = color;
    select.appendChild(newOption);
  }
}

// Affichage des données correspondant au produit selectionné sur la page accueil

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
 ****************************** script partie n° 2 : Validation du pannier et enregistrement dans le localstorage  *************
 *******************************************************************************************************************************/


 /*** variable *** */
 let inputQtyValid = false;
 let inputColorValid = false;

/****   declaration des fonctions ****/

// Bloque la soumission du panier en desactivant le btn "ajouter au panier"
function disabledButtonCart(){
  buttonCart.setAttribute("disabled", "disabled");
}

// Autorise la soumission du panier en activant le btn "ajouter au panier"
function enabledButtonCart(){
  buttonCart.removeAttribute("disabled");
}

//initialisation du panier
function initCart() {
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

// recupere la quantite defini par l' utilisateur
function getQuantity() {
  const qtyProducts = document.getElementById("quantity");
  let qtyProductsValue = parseInt(qtyProducts.value);
  return qtyProductsValue;
}

//modifi la variable de controle dès une modification de la quantité
function flagQty(qty){
  if(qty > 100 || qty < 1){
    inputQtyValid = false;
    disabledButtonCart();
    console.log(inputQtyValid)
    return
  }
  inputQtyValid = true;
  if(inputColorValid){
    enabledButtonCart();
  }
  console.log(inputQtyValid);
}

// Controle si la quantite entree par l' utilisateur est valide (positive)
function validateQuantity(qty) {

     
     
      let inputQty = document.querySelector("input[name='itemQuantity']");

      if (qty > 100 || qty < 1) {
      
          inputQty.style.border = "2px solid red";
          inputQtyValid = false;
          disabledButtonCart();
        
          setTimeout(function(){

          alert("Veuillez entrer une quantité comprise entre 1 et 100 inclu");
          
                  
          
        }, 250);
        return
      }

    inputQty.style.border = "2px solid transparent";
    inputQtyValid = true;

    if(inputColorValid){
      enabledButtonCart();
    }
 
}

// recupere la couleur defini par l' utilisateur
function getColor() {
  const colorProduct = document.getElementById("colors");
  let colorProductValue = colorProduct.value;
  return colorProductValue;
}

// controle si une couleur valide a été selectionné par l' utilisateur
function validateColor(color) {
  let selectColor = document.getElementById("colors");
  let arrayOfOptionColor = document.querySelectorAll("option");
  console.log(arrayOfOptionColor);

  for (option of arrayOfOptionColor) {
    if (color == option.innerText) {
      selectColor.style.border = "2px solid transparent";
      inputColorValid = true;

      if(inputQtyValid){
        enabledButtonCart();
      }
      
      return 
    }
  }
  selectColor.style.border = "2px solid red";
  inputColorValid = false;

  disabledButtonCart();
  
  setTimeout(function(){

    alert("veuillez selectionner une couleur dans la liste proposée");
    
  },250);
  return ;
}

//enregistre les données du panier dans le local storage
function saveCartInLocalStorage(actualCart) {
  window.localStorage.setItem("product", JSON.stringify(actualCart));
}

// redirige l' utilisateur vers la page panier
function locationToCartPage() {
  window.location.href = "./cart.html";
}

//Verifie si le nouveau produit existe deja dans le panier actuel
function isNewProductAlreadyExist(newProduct, actualCart) {
  for (let i in actualCart) {

    // Si le produit existe deja dans le panier actuel, retourne son indexe
    if (
      newProduct.id == actualCart[i].id &&
      newProduct.color == actualCart[i].color
    ) {

      return parseInt(i);
    }
  }
  // Si le produit n'existe pas on retourne -1
  return -1;
}

// Enregistre le nouveau produit dans le panier lors du click sur le boutton "ajouter au panier"

function pushToCart() {
  // initialisation du panier
  let actualCart = initCart();
  console.log(actualCart);

  // recupère la qte  choisi par l' utilisateur
  let qty = getQuantity();

  

  /*// controle si la quantite entree par l' utilisateur est valide
  let validQty = validateQuantity(qty);
  if(!validQty){

    return
  }*/

  // recupere la couleur choisi par l' utilisateur
  let color = getColor();

  // controle si une couleur valide a été selectionné par l' utilisateur
  /*let validColor = validateColor(color);

  if (!validColor) {
    return;
  }*/

  // recupere l' id du produit dans l 'url
  let productId = getIdProductFromUrl();

  // objet textuel representant le nouveau produit à enregister dans le panier
  let newProductToPushInCart = {
    id: productId,
    qty: qty,
    color: color,
  };

  console.log(newProductToPushInCart);

  // Verifie si le nouveau produit existe deja dans le panier actuel
  let productIndexIfExist = isNewProductAlreadyExist(
    newProductToPushInCart,
    actualCart
  );

  // si le nouveau produit n' existe pas deja dans le panier actuel on le rajoute
  if (productIndexIfExist == -1) {
    actualCart.push(newProductToPushInCart);
  }

  // si le nouveau produit existe deja dans le panier actuel on modifie la quantite en fonction de l' input utilisateur
  else {
    actualCart[productIndexIfExist].qty =
      parseInt(qty) + parseInt(actualCart[productIndexIfExist].qty);
  }

  // Enregistrement du panier dans le local storage
  saveCartInLocalStorage(actualCart);
  //redirection vers page panier
  locationToCartPage();
}

function listener(){

  inputSetColor.addEventListener("change", function(){validateColor(this.value)});
  inputSetQty.addEventListener("change", function(){validateQuantity(this.value)});
  inputSetQty.addEventListener("input", function(){flagQty(this.value)});
  buttonCart.addEventListener("click", pushToCart);
}

// controle les inputs utilisateur à l'ouverture de la page
function firstCheckInput(){
  let inputColor = document.getElementById("colors");
  inputColor.style.border = "2px solid red";
  let inputQty = document.getElementById("quantity");
  inputQty.style.border = "2px solid red";

  setTimeout(function(){
    alert("Veuillez entre une quantité et une couleur de votre choix, avant ajouter l' article au panier");
  }, 1500);

}


// fonction globale pour l' execution du script principal

function runKanapProduct() {

   
  
  disabledButtonCart();

  displayDataProductById();

  listener();

  firstCheckInput();

  
  

}

/********************************************** script principal  *********************************************/

// execution du script principal
runKanapProduct();
