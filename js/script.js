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

        cropBtn.disabled = false;
    }
}

Object.keys(events).forEach(eventName => {
    preview.addEventListener(eventName, events[eventName]);
    selection.addEventListener(eventName, events[eventName]);
});

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let filterLoad = false;

function onloadImage() {
    const {width, height} = image;
    canvas.width = width;
    canvas.height = height;
    filterLoad = true;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(image, 0, 0);

    preview.src = canvas.toDataURL();
    cropBtn.disabled = true;
    document.getElementById('download').disabled = false;
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

function filters(x){
    let value = x.value;
    
    if(filterLoad){
        switch(value) {
            case 1:
                ctx.filter = 'none';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'none';
                break;
    
            case 2:
                ctx.filter = 'blur(5px)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'blur(5px)';
                break;
    
            case 3:
                ctx.filter = 'brightness(150%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'brightness(150%)';
                break;
            case 4:
                ctx.filter = 'contrast(150%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'contrast(150%)';
                break;
    
            case 5:
                ctx.filter = 'grayscale(100%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'grayscale(100%)';
                break;
    
            case 6:
                ctx.filter = 'hue-rotate(90deg)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'hue-rotate(90deg)';
                break;
    
            case 7:
                ctx.filter = 'invert(100%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'invert(100%)';
                break;
    
            case 8:
                ctx.filter = 'opacity(70%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'opacity(70%)';
                break;
    
            case 9:
                ctx.filter = 'saturate(150%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                 preview.style.filter = 'saturate(150%)';
                break;
    
            case 10:
                ctx.filter = 'sepia(100%)';
                ctx.drawImage(preview, 0, 0, canvas.width, canvas.height);
                preview.style.filter = 'sepia(100%)';
                break;
        }
    }
}