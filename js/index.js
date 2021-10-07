let color_1= 'black';
let color_2= null;
let color_3= null;
let array_color = ["black",null,null]

async function dropHandler(event) {
    event.preventDefault();
    clear();
    
    const items = event.dataTransfer.items;
    let breakpoint = items.length;      

    if (items && items.length >= 1 && items[0].kind === 'file') {
      for (let index = 0; index < items.length; index++) {
        console.log('index:', items.length)

        const file = items[index].getAsFile();
        setTimeout(async function(){
          triggerDownload(await audioToSvg(file),index,file.name);

        }, 100);
      }; 
      
    }
  }

async function selectFiles(event) {
    event.preventDefault();
    clear();
    
    let items = event.target.files;
    console.log(items)
    let breakpoint = items.length;      

    if (items && items.length >= 1) {
      for (let index = 0; index < items.length; index++) {
        console.log('index:', items.length)

        const file = items[index];
        setTimeout(async function(){
          triggerDownload(await audioToSvg(file),index,file.name);

        }, 100);
      }; 
      
    }
  }

  function audioToSvg(file) {
    return new Promise(resolve => {
      const canvas = new C2S(100,200);
      canvas.style = {};
      HTMLCanvasElement.prototype.getContext = () => canvas;
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
        
      });
      wavesurfer.on('ready', () => {
        canvas.save();
        requestIdleCallback(() => resolve(canvas.getSerializedSvg(true)));
      });
      wavesurfer.loadBlob(file);
    });
  }

  function triggerDownload(svg,index,name) {
    let svgDiv = document.createElement('div');
    let h4 = document.createElement('h4');
    h4.innerHTML = name;
    svgDiv.id = "image-"+index;
    svgDiv.className = "svg-div pb-5";
    svgDiv.innerHTML = svg;
    var container = document.getElementById('svg-panel');

    container.appendChild(h4);
    container.appendChild(svgDiv);
  }

  function updateColor(index) {
    var input = document.getElementById('input_color_'+index);
    console.log(input.value)
    array_color[index]=input.value
  }

  function addColor(index) {
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
    var palette = document.getElementById('palette_color_'+index);
    palette.style.display ="none"
    var input = document.getElementById('input_color_'+index);
    input.style.display ="none"
    var button = document.getElementById('button_color_'+index);
    button.style.display ="block"
    array_color[index]=null
  }

  function clear() {
    var resetPanel = document.getElementById('reset-panel');
    resetPanel.style.display ="block"

    var svgPanel = document.getElementById('svg-panel');
    svgPanel.innerHTML=""

    var optionPanel = document.getElementById('option-panel');
    optionPanel.style.display ="none"

    var dropPanel = document.getElementById('drop-panel');
    dropPanel.style.display ="none"
  }

  function reset() {
    window.location.reload()
  }

  function getGradientPartByIndex(index) {
    switch(index){
        case 0:
            return 0.3
        case 1:
            return 0.6
        case 2:
            return 1
    }
  }