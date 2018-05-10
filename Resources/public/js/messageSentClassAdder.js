var form = document.querySelector('.message-form__d__new');
var hasBeenAnimated = false;

function messageAddClass(e){
    e.target.classList.add('message-form__d__new__s__sent');
    hasBeenAnimated = true;
}

if(form && !hasBeenAnimated){
    form.addEventListener('submit', function (e) {
            messageAddClass(e);
    });
};