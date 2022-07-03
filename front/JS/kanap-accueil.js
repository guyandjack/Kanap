/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des produits sur la page accueil**************************
 **************************************************************************************************************
 **************************************************************************************************************/

//****** déclaration des constantes globales ********

const apiUrl = "http://localhost:3000/api/products";

//****** déclaration des constantes liées au DOM ****

const sectionItems = document.getElementById("items");

//****** déclaration des fonctions  *****************



// crée un élément html "a", avec attribut href contenant id du produit"
function createLink(idProduct) {
  newLink = document.createElement("a");
  newLink.setAttribute("href", "./product.html?id=" + idProduct);
  sectionItems.appendChild(newLink);
}

//crée un élément html "article" dans l' élément html "a"
function createArticle() {
  newArticle = document.createElement("article");
  newLink.appendChild(newArticle);
  return newArticle
}

//crée un élément html "img" avec attribut src et alt dans l' élément "article"
function createImg(imgUrl, altText) {
  newImg = document.createElement("img");
  newImg.setAttribute("alt", altText);
  newImg.setAttribute("src", imgUrl);
  newArticle.appendChild(newImg);
}

//crée un élément html "h3" avec son contenu textuel dans l' élément "article"
function createH3(productName) {
  newH3 = document.createElement("h3");
  newH3.setAttribute("class", "productName");
  newH3.innerText = productName;
  newArticle.appendChild(newH3);
}

//crée un élément html "p" avec son contenu textuel dans l' élément "article"
function createP(productDescription) {
  newP = document.createElement("p");
  newP.setAttribute("class", "productDescription");
  newP.innerText = productDescription;
  newArticle.appendChild(newP);
}

// Affiche un seul produit
function displayOneproduct(idProduct, productName, imgUrl, altText, productDescription) {
  
  createLink(idProduct);
  let newArticle = createArticle();
  createH3(productName);
  createImg(imgUrl, altText);
  createP(productDescription);
}

// Fonction principale permetant la communication avec l' API et l' affichage des produits

function displayProducts() {

  // Accession à l' API via son Url
  fetch(apiUrl)

    // Conversion au format Json des données recues de l' API
    .then(function (res) {
      
      return res.json()
    })

    // extrait les informations de chaque élèment de l' objet au format json
    .then(function (data) {
      
      for (let item of data) {

        let idproduct = item._id;
        let productName = item.name;
        let imgUrl = item.imageUrl;
        let altText = item.altTxt;
        let productDescription = item.description;
        displayOneproduct(idproduct, productName, imgUrl, altText, productDescription);
      }
    })

    // Affichage d' une erreur éventuelle dans une fenetre pop up
    .catch(function (err) {
      alert("il s'est produit une erreur: " + err);
    });
}

// ******************************************************** script principal ************************************************

// Execution du script

displayProducts();
