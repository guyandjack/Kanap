/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des infos produits sur la page produit**********************
 **************************************************************************************************************
 **************************************************************************************************************/

/*** constantes liées au DOM ************/
const buttonCart = document.getElementById("addToCart");

/*** variables de fonctionnement*** */

// contient la valeur du local storage sous forme d' objet
let cart;

// Initialisation de la variable "cart" avec le local storage si un produit existe dans ce dernier
if (window.localStorage.getItem("product") != null) {
  cart = JSON.parse(window.localStorage.getItem("product"));
} else {
  cart = [];
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

function insertDataText(name, price, desc) {
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
function saveCartInLocalStorage(arg) {
  window.localStorage.setItem("product", JSON.stringify(arg));
}

/*//Verifie si le nouveau produit existe deja
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
}*/

// enrgistre les produits, la qte, la couleur dans le panier
function pushToCart() {
  // recupere la qte et la couleur choisi par l' utilisateur
  let qty = getQuantity();
  let color = getColor();

  // nouveau produit
  let newProductToPushInCart = {
    id: idValue,
    qty: qty,
    color: color,
  };

  console.log(cart);
  console.log(newProductToPushInCart);

  // verifie si le produit existe deja dans le panier
  let check = checkNewProductIfAlreadyExist(newProductToPushInCart, cart);
  console.log(check);

  // si le nouveau produit n' existe pas on le rajoute au panier
  if (check.ifexist == false) {
    cart.push(newProductToPushInCart);
  }
  // si il existe on modifie la quantite correspondant au produit du pannier existant
  else {
    cart[check.indexitemexist].qty =
      parseInt(check.newqty) + parseInt(cart[check.indexitemexist].qty);
  }

  saveCartInLocalStorage(cart);

  //redirection vers page panier
  window.location.href = "./cart.html";
}

// fonction globale pour l' execution du script principal

function runKanapProduct() {
  
  // Affiche dans la page product, le produit selctionné par l' utilisteur .

  displayDataProductById();

  // Enregistre le produit dans le panier lorsque l' utilisteur click sur "ajouter au panier"

  buttonCart.addEventListener("click", pushToCart);
}

/********************************************** script principal  *********************************************/

// execution du script
runKanapProduct();
