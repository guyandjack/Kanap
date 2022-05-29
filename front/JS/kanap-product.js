/**************************************************************************************************************
 **************************************************************************************************************
 *********************             site: Kanap             ****************************************************
 ******************* script permetant l' affichage des infos produits sur la page produit**********************
 **************************************************************************************************************
 **************************************************************************************************************/

//******  constantes globales ********

const apiUrl = "http://localhost:3000/api/products";


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
        idValue = urlValue.searchParams.get("id");
              
        return idValue
    }
    catch(e){

        return e.code;

    }
}

//permet de recuperer les données du produit correspondant à l' id passé dans l' url

function getDataProductById(){

    
        fetch(apiUrl)

        // Conversion au format Json des données recues de l' API
        .then (function(res){
        
            return res.json() 
        }
        )
        
        // extrait l' id des produits de l' API et le compare à l' id de l' url de la page courante
        .then (function(value) {

            data = value;
            for (let i = 0; i < data.length; i++){
                
                if(idValue === data[i]._id){
                    
                     imgUrlValue = data[i].imageUrl;
                     nameValue = data[i].name;
                     priceValue = data[i].price;
                     descriptionValue = data[i].description;
                }
            }

            
        }
        )
        
   
        // Affichage d' une erreur éventuelle dans une fenetre pop up
        .catch (function(err){

            alert("il s'est produit une erreur: " + err);
        }
        );

    

}


//crée un élément html "img" avec attribut src et alt dans l' élément "div class=items__img"

 function createImg(){

    newImg = document.createElement("img");
    newImg.setAttribute("alt", "Photographie d'un canapé");
    newImg.setAttribute("src", imgUrlValue);
    containerImg.appendChild(newImg);

}

// Implémente les données dans les éléments du DOM

function pushData(){

    createImg();
    productName.innerText = nameValue;
    productPrice.innerText = priceValue;
    productDescription.innerText = descriptionValue;
    
   
}

// Fonction principale qui regroupe l' ensemble des fonctions permetant  l' affichage des données correspondant a un produit

function displayOneProduct(){

    getDataUrl();
    getDataProductById();
    pushData();
}

/**************** code principal ***********************/

// fonction principale pour la page product

displayOneProduct();