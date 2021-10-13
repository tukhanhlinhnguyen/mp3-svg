function clear() {
    //clean the user's interfacer
    var resetPanel = document.getElementById('reset-panel');
    resetPanel.style.display ="block"

    var svgPanel = document.getElementById('svg-panel');
    svgPanel.innerHTML=""

    var optionPanel = document.getElementById('option-panel');
    optionPanel.style.display ="none"

    var dropPanel = document.getElementById('drop-panel');
    dropPanel.style.display ="none"
}

function getIndexFromId(str) {
    //get the int part from a string
    return str.replace(/\D/g, "");
}
  
//convert b64 img to blob
function b64toBlob(dataURI) {
    
var byteString = atob(dataURI.split(',')[1]);
var ab = new ArrayBuffer(byteString.length);
var ia = new Uint8Array(ab);

for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
}
return new Blob([ab], { type: 'image/png' });
}

function getPreset(presetName) {
    switch(presetName){
        case 'darkwall1':
        return {
            textureX:260,
            textureY:243,
            textureWidth:457,
            textureHeight:181,
            textColor:'black',
            waveX:300,
            waveY:302
        };
        
        case 'darkwall2':
        return {
            textureX:394,
            textureY:280,
            textureWidth:457,
            textureHeight:181,
            textColor:'black',
            waveX:435,
            waveY:342
        };

        case 'darkwalldark':
        return {
            textureX:209,
            textureY:230,
            textureWidth:457,
            textureHeight:181,
            textColor:'white',
            waveX:249,
            waveY:300
        };
        case 'darkwalldark2':
        return {
            textureX:405,
            textureY:283,
            textureWidth:457,
            textureHeight:181,
            textColor:'white',
            waveX:441,
            waveY:352
        };
    }
}

function reset() {
    //reset the view
    window.location.reload()
}

function getGradientPartByIndex(index) {
    //we now only have maximum 3 breakpoints for the gradient
    switch(index){
        case 0:
            return 0.3
        case 1:
            return 0.6
        case 2:
            return 1
    }
}