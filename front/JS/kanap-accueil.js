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



// crée un élément html "a", avec attribut href contenant les données pour la page produit, dans l' élément html "section id=items" 
function createLink(i){

    newLink = document.createElement("a");
    let idValue = data[i]._id;
    newLink.setAttribute("href", "./product.html?id=" + idValue );
    sectionItems.appendChild(newLink);
 
}

//crée un élément html "article" dans l' élément html "a"
function createArticle(){
    
    newArticle = document.createElement("article");
    newLink.appendChild(newArticle);
}


//crée un élément html "img" avec attribut src et alt dans l' élément "article"
function createImg(i){

    newImg = document.createElement("img");
    let altValue = data[i].altTxt;
    let srcValue = data[i].imageUrl;
    newImg.setAttribute("alt", altValue);
    newImg.setAttribute("src", srcValue);
    newArticle.appendChild(newImg);

}

//crée un élément html "h3" avec son contenu textuel dans l' élément "article"
function createH3(i){

    newH3 = document.createElement("h3");
    newH3.setAttribute("class", "productName");
    let nameValue = data[i].name;
    let newText = document.createTextNode(nameValue);
    newH3.appendChild(newText);
    newArticle.appendChild(newH3);

}

//crée un élément html "p" avec son contenu textuel dans l' élément "article"
function createP(i){

    newP = document.createElement("p");
    newP.setAttribute("class", "productDescription");
    let descriptionValue = data[i].description;
    let newTextP = document.createTextNode(descriptionValue);
    newP.appendChild(newTextP);
    newArticle.appendChild(newP);
}

// fonction qui permet de créer un ensemble d' élément contenant les références produits
function createBlockElements(compteur){
    let i = compteur;
    createLink(i);
    createArticle();
    createH3(i);
    createImg(i);
    createP(i);
}




// Fonction principale qui regroupe l' ensemble des fonctions permetant la communication avec l' API et l' affichage des produits

function displayProducts(){
    
    // Accession à l' API via son Url
    fetch(apiUrl)

    // Conversion au format Json des données recues de l' API
    .then (function(res){
        console.log(res)
        res2 = res.json();
        console.log(res2)
        console.log(res)
        return res2 
      }
    )
    
    // extrait les informations de chaque élèment de l' objet au format json
    .then (function(value) {

        data = value;
        for (let i = 0; i < data.length; i++){
            
            createBlockElements(i)
        }
    }
    )
   
    // Affichage d' une erreurr éventuelle dans une fenetre pop up
    .catch (function(err){
        alert("il s'est produit une erreur: " + err);
    }
    )

    
}





// ****************************************** Code principal **************************************


// fonction principale pour la page accueil

displayProducts();






