// Button status 
const listButtonStatus = document.querySelectorAll("[button-status]");
console.log(listButtonStatus);
// if(listButtonStatus.length > 0){
//     listButtonStatus.forEach(button => {
//         button.addEventListener("click",() => {
//             const status = button.getAttribute("button-status");
//             console.log(status);
//         });
//     });
// }
// console.log(listButton);
/* Pagination */
// Update the quantities in cart
const listInputQuantity = document.querySelectorAll("[cart] input[name='quantity']");
if(listInputQuantity.length > 0){
    listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            console.log("OK");
            const productId = input.getAttribute("product-id");
            const quantity = parseInt(input.value);
            if (productId && quantity > 0){
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
        })
    }
    )
}