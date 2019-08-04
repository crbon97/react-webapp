import { message } from 'antd'
import piexif from 'piexifjs'

export const handleErr = (error, showMessage) => {
    if(error.response) {
        if(showMessage) {
            message.error(error.response.data)
        }
        else{
            console.log(error.response.data)
        }
    }
    else if(error.request) {
        // The request was made but no response was received
        console.log(error.request)
    }
    else {
        console.log(error.message)
    }
}

function resizeImage(image){
    var MAX_WIDTH = 500;
    var MAX_HEIGHT = 500;
    var width = image.width;
    var height = image.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    var result = {
        width : width,
        height : height
    }
    return result;
}

function dataURLtoFile (dataurl, filename){
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export var resizePNGImageFn = (file) => {
    var result = {
        imgPreviewUrl: null,
        newFile: null
    }
    return new Promise((resolve, reject) => {
        try{
            let reader = new FileReader()
            var newFile = null;
            reader.readAsDataURL(file)
            reader.onload = (e) => {
            var image = document.createElement("img");
                image.onload = () => {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);

                    var resultResize = resizeImage(image);
                    canvas.width = resultResize.width;
                    canvas.height = resultResize.height;
                    canvas.getContext('2d').drawImage(image, 0, 0, resultResize.width, resultResize.height);
                    var dataurl = null;
                    dataurl = canvas.toDataURL("image/png", 0.25);
                    newFile = dataURLtoFile(dataurl, file.name);
                    result.imgPreviewUrl = e.target.result;
                    result.newFile = newFile;
                    resolve(result);
                }
                image.src = e.target.result;
            }
        }catch(err){
            reject(err);
        }
    });
}

function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };

}

export var resizeJPGImageFn = (file) => {
    return new Promise((resolve, reject) => {
        getBase64(file, (base64data) => {
            let newFile = null;
            let fileBase64 = base64data;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                try {
                    var exif = piexif.load(fileBase64);
                    var image = document.createElement("img");
                    image.onload =  () => {
                        var orientation = exif["0th"][piexif.ImageIFD.Orientation];
                        var canvas = document.createElement("canvas");
                        var imageWidth = image.width;
                        var imageHeight = image.height;
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;
                        var ctx = canvas.getContext("2d");
                        var x = 0;
                        var y = 0;
                        ctx.save();
                        if (orientation === 2) {
                            x = -canvas.width;
                            ctx.scale(-1, 1);
                        } else if (orientation === 3) {
                            x = -canvas.width;
                            y = -canvas.height;
                            ctx.scale(-1, -1);
                        } else if (orientation === 3) {
                            x = -canvas.width;
                            y = -canvas.height;
                            ctx.scale(-1, -1);
                        } else if (orientation === 4) {
                            y = -canvas.height;
                            ctx.scale(1, -1);
                        } else if (orientation === 5) {
                            canvas.width = imageHeight;
                            canvas.height = imageWidth;
                            ctx.translate(canvas.width, canvas.height / canvas.width);
                            ctx.rotate(Math.PI / 2);
                            y = -canvas.width;
                            ctx.scale(1, -1);
                        } else if (orientation === 6) {
                            canvas.width = imageHeight;
                            canvas.height = imageWidth;
                            ctx.translate(canvas.width, canvas.height / canvas.width);
                            ctx.rotate(Math.PI / 2);
                        } else if (orientation === 7) {
                            canvas.width = imageHeight;
                            canvas.height = imageWidth;
                            ctx.translate(canvas.width, canvas.height / canvas.width);
                            ctx.rotate(Math.PI / 2);
                            x = -canvas.height;
                            ctx.scale(-1, 1);
                        } else if (orientation === 8) {
                            canvas.width = imageHeight;
                            canvas.height = imageWidth;
                            ctx.translate(canvas.width, canvas.height / canvas.width);
                            ctx.rotate(Math.PI / 2);
                            x = -canvas.height;
                            y = -canvas.width;
                            ctx.scale(-1, -1);
                        }
                        ctx.drawImage(image, x, y);
                        ctx.restore();

                        var dataURL = canvas.toDataURL("image/jpeg", 0.25);
                        if(exif["0th"][piexif.ImageIFD.Orientation] !== 1){
                            exif["0th"][piexif.ImageIFD.Orientation] = 1;
                        }
                        var exifStr = piexif.dump(exif);
                        var newDataURL = piexif.insert(exifStr, dataURL)
                        newFile = dataURLtoFile(newDataURL, file.name);
                        var result = {
                            imgPreviewUrl: null,
                            newFile: null
                        }
                        result.imgPreviewUrl = newDataURL;
                        result.newFile = newFile;
                        resolve(result);
                    }
                    image.src = e.target.result; 
                } catch (error) {
                    reject(error);
                }
            }
        }, err => {
            reject(err);
        });
    });
}