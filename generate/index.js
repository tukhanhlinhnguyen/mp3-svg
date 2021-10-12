async function dropHandler(event) {

    //prevent another drop
    event.preventDefault();

    //collect file list
    const items = event.dataTransfer.items;

    //loop through the list and generate svg
    if (items && items.length >= 1 && items[0].kind === 'file') {
      for (let index = 0; index < items.length; index++) {

        const file = items[index].getAsFile();

        var reader = new FileReader();

        reader.onload  = function (e) {
            console.log("jere")
            //prepare SGV div container
            let svgDiv = document.createElement('img');
            svgDiv.id = "image";
            svgDiv.className = "svg-div pb-5";
            svgDiv.src = e.target.result;
            var container = document.getElementById('svg-panel');

            container.appendChild(svgDiv);
        }
        reader.readAsDataURL(file);

        //add a brief time out otherwise the loop will freeze
        setTimeout(async function(){
          displaySvg(file,index,file.name);

        }, 100);
      }; 
      
    }
}

function displaySvg(svg,index,name) {
    mergeImages([ {src: '../img/2.png'},{src: '../img/canvas.png',x:260,y:243,width:457,opacity: 0.1,
        height:181,quality:0.99}],{width:1200,
            height:1200,quality:0.99,format:'image/png',svg:svg}).then(b64 => {
                document.getElementById('img').src=b64;
        
    });

    

  }


