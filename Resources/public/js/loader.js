var loader = document.querySelector(".loader");
var animationOn = false;

// //on vérifie s'il y a un form nouveau message
// var newMsg = document.querySelector(".message-form__d__new");

// //on ajoute un eventlistener sur l'animation
// newMsg.addEventListener('animationstart', function(e){
//     animationOn = true;
// });

// newMsg.addEventListener('animationend', function(e){
//     animationOn = false;
//     loaderClassAdder();
// })

function loaderClassAdd() {
    loader.classList.add("loader-active");    
}

function loaderClassRemove(){
    loader.addEventListener('animationiteration', function(e){
        e.target.classList.remove("loader-active");
    });

    loader.addEventListener('webkitAnimationIteration', function (e) {
        e.target.classList.remove("loader-active");
    });

    loader.addEventListener('MSAnimationIteration', function (e) {
        e.target.classList.remove("loader-active");
    });
    
    
    // loader.classList.remove("loader-active");
}

window.addEventListener('beforeunload', function(e){

    if(animationOn){
        return;
    }

    //check if popup is active
    var popup = document.querySelector('.popup');
    if(popup && !popup.classList.contains('closed')){
        popup.classList.add('closed');
    }
    loaderClassAdd();
});

window.addEventListener('load', function (e) {
    if(loader.classList.contains("loader-active")){
        loaderClassRemove();
    }
});
