/**************************************************************************************************************
 **************************************************************************************************************
 ***********                       site: Kanap / page: confirmation.html                       ****************
 ***********          
 *********           script : Affichage du numero de commande issu de l' API                *************

  **************************************************************************************************************
 **************************************************************************************************************/

/**** déclaration des fonctions **** */

// recupere le numero de commande dans l' url de la page courante

function getOrderNumberFromUrl() {
  let currentUrl = document.URL;
  let urlObject = new URL(currentUrl);
  let orderNumber = urlObject.searchParams.get("orderId");
  return orderNumber;
}

// Affiche le numero de commande dans la page
function displayOrderNumber(orderId) {
  let divOrder = document.getElementById("orderId");
  divOrder.innerText = orderId;
}

//vide le panier contenu dans le local storage
function deleteCart() {
  window.localStorage.clear();
}

// fonction globale pour l' execution du script principal

function runKanapConfirm() {

  let orderNumber = getOrderNumberFromUrl();
  displayOrderNumber(orderNumber);
  deleteCart();
}


/************************ script principal ************************************************** */
runKanapConfirm();
