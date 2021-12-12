const api_key = "0e89f8a5d1213ff74ea2c9a7e44f7f40";
const api_key_geocoding = "07Xm7PKfZkdcTPzZqYfAPvCSb4ryjOsv";
const air_api_key = "0b73b1aca81b7059ece649c61736f3e6c21acb9e";


let input = document.querySelector('#insertInput');

let generalContainer = document.querySelector('#generalContainer');

let container = document.querySelector('#scheduleContainer');

let canvasContainer = document.querySelector('#canvasContainer');

let selections = document.querySelector('#selectElement');
// selections.setAttribute('id', 'selections');
selections.classList.add('selectStyle');
// selections.style.float = 'right';
generalContainer.append(container, selections);

let geolocationBtn = document.querySelector('#locationContainer');
console.log(geolocationBtn);

// ----- Testing createCanvas from fly


// let newCanvasElement = {};

// newCanvasElement.setup = function () {
//   createCanvas(400, 400);
//   background(200);
// }
// newCanvasElement.draw = function () {
//   fill(40);
//   ellipse(200, 200, 20, 20);
// }


// let setup = new Function('this.createCanvas(400, 400); this.background(40);');
// let draw = new Function('fill(20); ellipse(200, 200, 20, 20);');
// ----- Testing createCanvas from fly



console.log(container);
// let data;
let sendingData = {};


let emptyOpt = new Option("Saved options...", "Saved options...", true, true);
selections.append(emptyOpt);

// console.log(localStorage);

let designOpt = new designOptions(selections);
designOpt.loadData();


input.addEventListener('change', async () => {

  // ---> togliere focus una volta inserita la località <---

  // test event input invece che change per riconoscimento vocale

  container.textContent = '';
  canvasContainer.style.display = 'none';
  container.classList = null;

  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${api_key_geocoding}&location=${input.value}`;

  let retrieveData = new RetrieveData(url, air_api_key);

  await retrieveData.retrievePosition();
  await retrieveData.retrieveAirData();

  setTimeout(() => {
    input.value = ''
  }, 3000);

  // let tab = new MakeTab(retrieveData.data, retrieveData.lat, retrieveData.lon, input.value, container);
  console.log(retrieveData.data);
  let tab = new MakeTab(retrieveData.data, input.value, container);
  tab.drawTab();
  canvasContainer.style.display = 'block';
  // let showCanvas = createCanvas(400, 400);

  // showCanvas.parent(tab);


  // ---- Testing appear Canvas
  // window.setup();
  // window.draw();


  // (function setup() {
  //   createCanvas(400, 400);
  //   background(200);


  // })();

  // (function draw() {
  //   fill(40);
  //   ellipse(200, 200, 40, 40);


  // })();


  // newCanvasElement.setup();
  // newCanvasElement.draw();

  // setup();
  // draw();
  // window.setup();
  // window.draw();
  // tab.setup();
  // tab.draw();

  showCanvas = true;

  // ---- Testing appear Canvas


  let button = document.createElement('button');
  let saveButton = new SaveButton(button, container);
  console.log(saveButton);
  saveButton.saveBtnCreation();

  saveButton.button.addEventListener('click', () => {
    // console.log(Object.keys(localStorage));
    if (localStorage[retrieveData.cityName]) {
      // Aggiungere rimozione campo esistente / aggiunta nuovo 
      // senza ripetere campo
      return;
    } else if (!(localStorage[retrieveData.cityName])) {
      let internalMemory = new InternalMemory(retrieveData.cityName, sendingData, retrieveData.data, selections);
      internalMemory.saveData();
    }

  });


});

selections.addEventListener('change', () => {
  console.log('Change element');
  console.log(selections.value);
  container.textContent = '';



  let tab = new LoadTab(localStorage[selections.value], selections.value, container);
  tab.drawTab();

});

document.addEventListener('click', (event) => {
  // let geo = navigator.geolocation;
  // console.log(geo);

  if (event.target.closest('#locationContainer')) {
    navigator.geolocation.getCurrentPosition(async (position) => {

      // let p = document.createElement('p');
      // p.textContent = 'Geoloction available';
      // container.append(p);

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      let reverseGeocodingURL = `https://open.mapquestapi.com/geocoding/v1/reverse?key=${api_key_geocoding}&location=${lat},${lon}`;
      let response = await fetch(reverseGeocodingURL);
      let json = await response.json();

      let title = `${json.results[0].locations[0].adminArea5}, ${json.results[0].locations[0].street}`;


      // obtainData(lat, lon);

      // console.log(obtainData.json);

      let dataByPos = new retrieveAirDataByPos(lat, lon, air_api_key);
      await dataByPos.retrieve();

      console.log(dataByPos.data);

      let makeDataByPosTab = new MakeTab(dataByPos.data, title, container);
      makeDataByPosTab.drawTab();

      let button = document.createElement('button');
      let saveButton = new SaveButton(button, container);
      console.log(saveButton);
      saveButton.saveBtnCreation();

      saveButton.button.addEventListener('click', () => {

        let postTitle;

        console.log(title.length)

        postTitle = title;

        if (localStorage[title]) {
          return;
          // aggiungere cancellazione vecchio campo e salvataggio
          // nuovo con lo stesso name
        } else if (!(localStorage[title])) {
          let internalMemory = new InternalMemory(postTitle, sendingData, dataByPos.data, selections);
          internalMemory.saveData();
        }

      });

    });
  }

});


// localStorage.clear();

// Aggiungere Protected field per emcapsulation?
// class CoffeeMachineFour {
//   _waterAmount = 0;

//   setWaterAmount(value) {
//     if (value < 0) {
//       value = 0;
//     }
//     this._waterAmount = value;
//   }

//   getWaterAmount() {
//     return this._waterAmount;
//   }
// }
// new CoffeeMachineFour().setWaterAmount(100);

function setup() {
  // noCanvas();

  let showCanvas = createCanvas(200, 200);
  showCanvas.parent(canvasContainer);
  // if (showCanvas) {
  background(200);
  // }

}

function draw() {
  // image(extraCanvas, 0, 0);
  fill(50);
  ellipse(200, 200, 20, 20);

}

// Per eventuale problema CORS provare option {mode: "cors" o credentials: "include"}

// let promise = fetch(url, {
// 	method: "GET", //POST, PUT, DELETE, HEAD, ecc
// 	headers: {
// 		// la value dell'header content type é di solito auto-impostata
// 		// in base al body della request
// 		"Content-Type": "text/plain; charset)UTF-8"
// 	},
// 	body: undefined, //string, FormData, Blob, BufferSource, o...
// 	// URLSearchParams
// 	referrer: "about:client", //o "" per non inviare un Referer header
// 	// o un url dall'origin corrente
// 	referrerPolicy: "no-referrer-when-downgrade", //no-referrer, ...
// 	// ...origin, same-origin...
// 	mode: "cors", //same-origin, no-cors
// 	credentials: "same-origin", //omit, include
// 	cache: "default", //no-store, reload, no-cache, force-cache,...
// 	// o only-if-cached
// 	redirect: "follow", //manual, error
// 	integrity: "", // un hash, come "sha256-abcdef1234567890"
// 	keepalive: false, //true
// 	signal: undefined, //AbortController per cancellare la request - vedi capitolo
// 	window: window //null
// });


// Inserire attribute tabindex nell'HTML dei tre elements selezionabili.

// Rivalutare event input nel campo di ricerca, o con un timeout dopo che si é inerito
// qualcosa che dopo 2 - 3 secondi avvi la richiesta in automatico.

// Valutare event input nella selezione delle option salvate.