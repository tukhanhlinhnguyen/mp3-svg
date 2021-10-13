async function dropHandler(event) {
  //prevent another drop
  event.preventDefault();

  //clean the result panel
  clear();

  //collect file list
  const items = event.dataTransfer.items;

  //loop through the list and generate svg
  if (items && items.length >= 1 && items[0].kind === 'file') {
    for (let index = 0; index < items.length; index++) {

      const file = items[index].getAsFile();

      var reader = new FileReader();

      reader.onload  = function (e) {
        

          //prepare SGV div container
          let svgDiv = document.createElement('img');
          svgDiv.id = "image"+index;
          svgDiv.className = "svg-img-holder";
          svgDiv.src = e.target.result;

          var container = document.getElementById('svg-panel');
          container.appendChild(svgDiv);
      }
      reader.readAsDataURL(file);

      //add a brief time out otherwise the loop will freeze
      setTimeout(async function(){
        processSvg(index,file.name);
      }, 100);
    }; 
  }
}

async function selectFiles(event) {

    
  //prevent another drop
  event.preventDefault();

  //clean the result panel
  clear();
  
  //collect file list
  let items = event.target.files;
  
  //loop through the list and generate svg
  if (items && items.length >= 1) {
    for (let index = 0; index < items.length; index++) {
      const file = items[index];

      var reader = new FileReader();

      reader.onload  = function (e) {
        

          //prepare SGV div container
          let svgDiv = document.createElement('img');
          svgDiv.id = "image"+index;
          svgDiv.className = "svg-img-holder";
          svgDiv.src = e.target.result;

          var container = document.getElementById('svg-panel');
          container.appendChild(svgDiv);
      }
      reader.readAsDataURL(file);

      //add a brief time out otherwise the loop will freeze
      setTimeout(async function(){
        processSvg(index,file.name);
      }, 100);
    }; 
    
  }
}

function download() {
// get all checked checkboxes
var checkedBoxes = getCheckedBoxes("svgCheckbox");
//init jszip
var zip = new JSZip();
// loop over all checked checkboxes
checkedBoxes.forEach((a) => {
  //get the svg content
  let index=getIndexFromId(a.id)
  var svg = document.getElementById('image-'+index);

  //define file's name
  let fileName=document.getElementById('title'+index).innerHTML;

  //generate the blob from svg content
  var blob = b64toBlob(svg.src);

  //add the file to the zip
  zip.file(fileName+".png", blob, {base64: true});
  
})
//download the zip file
zip.generateAsync({type:"blob"})
.then(function(content) {
    saveAs(content, "product-photo-png.zip");
});
}

function processSvg(index,fileName) {

  //get select bgImage
  let bgImg = document.getElementById('image_picker').value

  //get preset
  let preset = getPreset(bgImg)

  //mergeImages([ {src: '../assets/img/darkwall1.png'},{src: '../assets/img/canvas.png',x:260,y:243,width:457,opacity: 0.1,
  mergeImages([ {src: `../assets/img/${bgImg}.png`},
      {src: '../assets/img/canvas.png', x:preset.textureX,y:preset.textureY, width:457, opacity: 0.1,
      height:183, quality:0.99}],{width:1200, height:1200, quality:0.99, format:'image/png', index:index,
      fileName:fileName, textColor:preset.textColor, waveX:preset.waveX, waveY:preset.waveY})
      .then(
      b64 => {
        //document.getElementById('img').src=b64;
        //prepare SGV div container
        let svgDiv = document.createElement('img');
        svgDiv.id = "image-"+index;
        svgDiv.className = "final-img-div pb-5";
        svgDiv.src = b64;

        //prepare sound title and checkbox
        let div = document.createElement('div');
        //remove the extension
        fileName = fileName.replace(/\.[^/.]+$/, "")
        div.innerHTML = '<input class="checkboxSVG" type="checkbox" checked name="svgCheckbox" id="Checkbox'+index+'"> <h4 id="title'+index+'">' + fileName +'</h4>';

        var container = document.getElementById('svg-panel');
        
        //assemble the panel
        container.appendChild(div);
        container.appendChild(svgDiv);
      });
}

//get checked boxes
function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
      // And stick the checked ones onto an array...
      if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
      }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}

//clean the user's interface
function clear() {
  var resetPanel = document.getElementById('reset-panel');
  resetPanel.style.display ="block"

  var svgPanel = document.getElementById('svg-panel');
  svgPanel.innerHTML=""

  // var optionPanel = document.getElementById('option-panel');
  // optionPanel.style.display ="none"

  var dropPanel = document.getElementById('drop-panel');
  dropPanel.style.display ="none"
}

//Init image-picker
$("select").imagepicker()

function test() {
  //mergeImages([ {src: '../assets/img/darkwall1.png'},{src: '../assets/img/canvas.png',x:260,y:243,width:457,opacity: 0.1,
  mergeImages([ {src: `../assets/img/darkwalldark2.png`},
      {src: '../assets/img/canvas.png', x:405,y:283, width:457, opacity: 0.1,
      height:183, quality:0.99}],{width:1200, height:1200, quality:0.99, format:'image/png',
      fileName:"rampampam", textColor:"white", waveX:441, waveY:352})
      .then(
      b64 => {
        //document.getElementById('img').src=b64;
        //prepare SGV div container
        let svgDiv = document.createElement('img');
        svgDiv.className = "final-img-div pb-5";
        svgDiv.src = b64;


        var container = document.getElementById('svg-panel');
        
        //assemble the panel
        container.appendChild(svgDiv);
      });
}

//test();
