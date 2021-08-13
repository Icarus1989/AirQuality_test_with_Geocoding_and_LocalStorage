const api_key = "0e89f8a5d1213ff74ea2c9a7e44f7f40";
const api_key_geocoding = "07Xm7PKfZkdcTPzZqYfAPvCSb4ryjOsv";
const air_api_key = "0b73b1aca81b7059ece649c61736f3e6c21acb9e";


let input = document.querySelector('#insertInput');

let generalContainer = document.querySelector('#generalContainer');

let container = document.querySelector('#scheduleContainer');

let selections = document.createElement('select');
// selections.setAttribute('id', 'selections');
selections.classList.add('selectStyle');
// selections.style.float = 'right';
generalContainer.append(selections, container);

let geolocationBtn = document.querySelector('#locationContainer');
console.log(geolocationBtn);



console.log(container);
// let data;
let sendingData = {};


let emptyOpt = new Option("Saved options...", "Saved options...", true, true);
selections.append(emptyOpt);

// console.log(localStorage);

let designOpt = new designOptions(selections);
designOpt.loadData();


input.addEventListener('change', async () => {

  container.textContent = '';
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


  let button = document.createElement('button');
  let saveButton = new SaveButton(button, container);
  console.log(saveButton);
  saveButton.saveBtnCreation();

  saveButton.button.addEventListener('click', () => {
    // console.log(Object.keys(localStorage));
    if (localStorage[retrieveData.cityName]) {
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
  // console.log(localStorage[selections.value]);
  // console.log(JSON.parse(localStorage[selections.value]));
  // console.log(Object.fromEntries(localStorage[selections.value]));
  container.textContent = '';



  let tab = new LoadTab(localStorage[selections.value], selections.value, container);
  tab.drawTab();

});

geolocationBtn.addEventListener('click', (event) => {
  // let geo = navigator.geolocation;
  // console.log(geo);

  if (event.target.id == 'locationContainer' || event.target.tagName == 'button' || event.target.tagName == 'div') {
    navigator.geolocation.getCurrentPosition(async (position) => {

      let p = document.createElement('p');
      p.textContent('Geoloction available');
      container.append(p);

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

        // ----- check

        // if (title.length > 20) {
        //   postTitle = title.slice(0, 19) + '...';
        // } else {
        //   postTitle = title;
        // }
        // console.log(Object.keys(localStorage));

        // -----
        // ----- check
        postTitle = title;

        if (localStorage[title]) {
          return;
        } else if (!(localStorage[title])) {
          let internalMemory = new InternalMemory(postTitle, sendingData, dataByPos.data, selections);
          internalMemory.saveData();
        }

      });

    });

    // console.log(lat);

    // async function obtainData(lat, lon) {
    //   let reverseGeocodingURL = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${api_key_geocoding}&location=${lat},${lon}`;
    //   let response = await fetch(reverseGeocodingURL);
    //   let json = await response.json();
    //   return json;

    //   // console.log(`${json.results[0].locations[0].adminArea5}, ${json.results[0].locations[0].street}`);
    // }





    // console.log(geo.toString()); 
  }

});


// localStorage.clear();