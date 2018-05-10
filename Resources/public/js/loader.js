var loader = document.querySelector(".loader");
var animationOn = false;

//on vérifie s'il y a un form nouveau message
var newMsg = document.querySelector(".message-form__d__new");

// //on ajoute un eventlistener sur l'animation
// newMsg.addEventListener('animationstart', function(e){
//     animationOn = true;
// });

// newMsg.addEventListener('animationend', function(e){
//     animationOn = false;
//     loaderClassAdder();
// })

// function loaderClassAdd() {
//     loader.classList.add("loader-active");    
// }

// function loaderClassRemove(){
//     loader.classList.remove("loader-active");
// }

// window.addEventListener('beforeunload', function(e){
//     if(animationOn){
//         return;
//     }
//     loaderClassAdd();
// });

// window.addEventListener('load', function (e) {
//     console.log('début du load');
//     if(loader.classList.contains("loader-active")){
//         loaderClassRemove();
//     }
// });
