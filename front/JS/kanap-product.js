/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des infos produits sur la page produit**********************
 **************************************************************************************************************
 **************************************************************************************************************/

/****** constantes liées au DOM ***** */

const containerImg = document.querySelector(".item__img");
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");


/***** declaration des fonctions ****** */

// permet de recuperer les données du produit dans l' url 

function getDataUrl(){

    try{
        let url = window.location.href;
        let urlValue = new URL(url);
        let srcValue = urlValue.searchParams.get("srcImg");
        let  nameValue = urlValue.searchParams.get("name");
        let priceValue = urlValue.searchParams.get("price");
        let descriptionValue = urlValue.searchParams.get("description");
        
        tabResults = {
            "img" : srcValue,
            "name" : nameValue,
            "price" :  priceValue,
            "description" : descriptionValue,
            
        };

        return tabResults
    }
    catch(e){

        return e.code;

    }
}

//crée un élément html "img" avec attribut src et alt dans l' élément "div class=items__img"

 function createImg(){

    newImg = document.createElement("img");
    let altValue = "Photographie d'un canapé";
    let srcValue = tabResults.img;
    newImg.setAttribute("alt", altValue);
    newImg.setAttribute("src", srcValue);
    containerImg.appendChild(newImg);

}

// Implémente les données dans les éléments du DOM

function pushData(){

    createImg();
    productName.innerText = tabResults.name;
    productPrice.innerText = tabResults.price;
    productDescription.innerText = tabResults.description;
    
   
}

// Fonction principale qui regroupe l' ensemble des fonctions permetant  l' affichage des données correspondant a un produit

function displayOneProduct(){

    getDataUrl();
    pushData();
}

/**************** code principal ***********************/

// fonction principale pour la page product

displayOneProduct();