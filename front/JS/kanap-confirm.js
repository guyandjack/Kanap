// recuperation du numero de commande dans l' url

function getOrderIdFromUrl(){
    
    let currentUrl = document.URL;
    let urlObject = new URL(currentUrl);
    let orderValue = urlObject.searchParams.get("orderId");
    console.log(orderValue)
    return orderValue
}

// Affiche le numero de commande 
function displayOrderId(orderId){

    let divOrder = document.getElementById("orderId");
    divOrder.innerText = orderId;

}

// fonction principale

function getAndDisplayOrder(){

    let orderValue = getOrderIdFromUrl();
    displayOrderId(orderValue);
}



getAndDisplayOrder();