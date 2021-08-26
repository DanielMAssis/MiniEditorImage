const photoFile = document.getElementById('photo-file');
let preview = document.getElementById('preview');
let image;
let photoName;

function load(){photoFile.click();}

window.addEventListener('DOMContentLoaded', () => {
    photoFile.addEventListener('change', () => {
        let file = photoFile.files.item(0);
        photoName = file.name;
        let reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = function(event){
            image = new Image();
            image.src = event.target.result;
            image.onload = onloadImage;
        }
    });
});

const selection = document.getElementById('selection-tool');
let startX, startY, relativeStartX, relativeStartY, endX, endY, relativeEndX, relativeEndY;
let startSelection = false;

const events = {
    mouseover(){
        this.style.cursor = 'crosshair';
    },
    mousedown(){
        const {clientX, clientY, offsetX, offsetY} = event;
        startX = clientX;
        startY = clientY;
        relativeStartX = offsetX;
        relativeStartY = offsetY;
        startSelection = true;
    },
    mousemove(){
        endX = event.clientX;
        endY = event.clientY;

        if(startSelection){
            selection.style.display = 'initial';
            selection.style.top = startY + 'px';
            selection.style.left = startX + 'px';
            selection.style.width = (endX - startX) + 'px';
            selection.style.height = (endY - startY) + 'px';
        }
    },
    mouseup(){
        startSelection = false;

        relativeEndX = event.layerX;
        relativeEndY = event.layerY;

        cropBtn.style.display = 'initial';
    }
}

Object.keys(events).forEach(eventName => {
    preview.addEventListener(eventName, events[eventName]);
    selection.addEventListener(eventName, events[eventName]);
});

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

function onloadImage() {
    const {width, height} = image;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(image, 0, 0);

    preview.src = canvas.toDataURL();
}

const cropBtn = document.getElementById('crop');

cropBtn.onclick = () => {
    const {width: imgW, height: imgH} = image;
    const {width: prevW, height: prevH} = preview;

    const [widthFactor, heightFactor] = [+(imgW / prevW), +(imgH / prevH)];

    const [selectWidth, selectHeight] = [
        +selection.style.width.replace('px', ''),
        +selection.style.height.replace('px', '')
    ];

    const [croppedWidth, croppedHeight] = [
        +(selectWidth * widthFactor),
        +(selectHeight * heightFactor)
    ];

    const [actualX, actualY] = [
        +(relativeStartX * widthFactor),
        +(relativeStartY * heightFactor)
    ];

    const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight);

    ctx.clearRect(0, 0, ctx.width, ctx.height);

    image.width = canvas.width = croppedWidth;
    image.height = canvas.height = croppedHeight;

    ctx.putImageData(croppedImage, 0, 0);

    selection.style.display = 'none';

    preview.src = canvas.toDataURL();

}

function download() {
    const a = document.createElement('a');
    a.download = photoName + '-edit.png';
    a.href = canvas.toDataURL();
    a.click();
}

function gray() {
    ctx.filter = 'grayscale(100%)';
    ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
    preview.style.filter = 'grayscale(100%)';
}

function inv() {
    preview.style.filter = 'invert(100%)';
}

function contra() {
    preview.style.filter = 'contrast(200%)';
}