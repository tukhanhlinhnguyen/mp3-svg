let color_1= 'black';
let color_2= null;
let color_3= null;
let array_color = ["black",null,null];
let array_svg = []

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

        //add a brief time out otherwise the loop will freeze
        setTimeout(async function(){
          displaySvg(await audioToSvg(file),index,file.name);
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
        console.log('index:', items.length)

        const file = items[index];

        //add a brief time out otherwise the loop will freeze
        setTimeout(async function(){
          displaySvg(await audioToSvg(file),index,file.name);

        }, 100);
      }; 
      
    }
  }

  function audioToSvg(file) {
    return new Promise(resolve => {
      let canvasSvg = new C2S('1600','800');
      canvasSvg.style = {};

      HTMLCanvasElement.prototype.getContext = () => canvasSvg;
      var linGrad = document.createElement('canvas').getContext('2d').createLinearGradient(0, 0, 1000, 128);
      
      
      array_color.forEach((color,index) => {
        if(color!=null){
            linGrad.addColorStop(getGradientPartByIndex(index), array_color[index]); 
        }
      })

      const wavesurfer = WaveSurfer.create({
        container: '#dummy',
        progressColor: linGrad,
        reflection: true,
        devicePixelRatio:3,
        height:800,
        fillParent:true
      });
      wavesurfer.on('ready', () => {
        canvasSvg.save();
        requestIdleCallback(() => resolve(canvasSvg.getSerializedSvg(true)));
      });
      wavesurfer.loadBlob(file);
     });
  }

  function displaySvg(svg,index,name) {

    //prepare SGV div container
    let svgDiv = document.createElement('div');
    svgDiv.id = "image-"+index;
    svgDiv.className = "svg-div pb-5";
    svgDiv.innerHTML = svg;
    svgDiv.style.transform = "scale(0.5)"

    array_svg.push(svg);

    //prepare sound title and checkbox
    let div = document.createElement('div');
    div.innerHTML = '<input class="checkboxSVG" type="checkbox" checked name="svgCheckbox" id="Checkbox'+index+'"> <h4 id="title'+index+'">' + name +'</h4>';

    var container = document.getElementById('svg-panel');
    
    //assemble the panel
    container.appendChild(div);
    container.appendChild(svgDiv);

    setTimeout( function(){
      var dummy = document.getElementById('dummy');
      dummy.style.display ="none"
      console.log('there')
    }, 1000);
  }

  function updateColor(index) {
    //collect color from the palette
    var input = document.getElementById('input_color_'+index);
    console.log(input.value)
    array_color[index]=input.value
  }

  function addColor(index) {
    //show the color palette
    var palette = document.getElementById('palette_color_'+index);
    palette.style.display ="block"
    var input = document.getElementById('input_color_'+index);
    input.style.display ="block"
    input.value ="#000000"
    var button = document.getElementById('button_color_'+index);
    button.style.display ="none"
    array_color[index]='black'
  }

  function removeColor(index) {
    //hide the color palette
    var palette = document.getElementById('palette_color_'+index);
    palette.style.display ="none"
    var input = document.getElementById('input_color_'+index);
    input.style.display ="none"
    var button = document.getElementById('button_color_'+index);
    button.style.display ="block"
    array_color[index]=null
  }

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
      console.log('fileName:', fileName)

      //generate the blob from svg content
      const blob = new Blob([svg.innerHTML], {type: "image/svg"});
      //remove the extension
      fileName = fileName.replace(/\.[^/.]+$/, "")
      console.log('fileName:', fileName)
      //add the file to the zip
      zip.file(fileName+".svg", blob, {binary: true});
      
    })
    //download the zip file
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "final-wave-svg.zip");
    });
  }