const photoFile = document.getElementById('photo-file');

function load(){
    document.getElementById('photo-file').click();
}

window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change', () => {
        let file = photoFile.files.item(0);
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event){
            let image = document.getElementById('preview');
            image.src = event.target.result;
        }
    });
});