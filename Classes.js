class designOptions {
  constructor(container) {
    this.container = container;
  }
  loadData() {
    for (let i = 0; i < localStorage.length; i++) {
      this.memoryOpt = new Option(localStorage.key(i), localStorage.key(i), false, false);
      this.container.append(this.memoryOpt);
    }
  }
}

class RetrieveData {
  constructor(geocodingURL, airAPIKey) {
    this.geocodingURL = geocodingURL;
    this.air_api_key = airAPIKey;
  }

  async retrievePosition() {
    this.posResponse = await fetch(this.geocodingURL);
    this.posJson = await this.posResponse.json();
    this.lat = await this.posJson.results[0].locations[0].latLng.lat;
    this.lon = await this.posJson.results[0].locations[0].latLng.lng;
    this.cityName = await this.posJson.results[0].providedLocation.location;
  }

  async retrieveAirData() {
    this.air_url = `https://api.waqi.info/feed/geo:${this.lat};${this.lon}/?token=${this.air_api_key}`;
    this.airResponse = await fetch(this.air_url);
    this.airJson = await this.airResponse.json();
    this.data = await this.airJson.data.iaqi;
  }

}

class MakeTab {

  setup = function () {
    // extraCanvas = createGraphics(400,400);
    createCanvas(400, 400);
    background(200);
  }

  draw = function () {
    fill(50, 50, 50);
    ellipse(200, 200, 20, 20);
  }
  constructor(data, value, containerElt) {
    this.data = data;
    // this.lat = latitude;
    // this.lon = longitude;
    this.value = value;
    this.container = containerElt;
    this.green = "#388E3C";
    this.yellow = "#FFEA00";
    this.orange = "#F57F17";
    this.red = "#E53935";
  }

  drawTab() {


    console.log(Object.values(this.data));
    console.log(Object.entries(this.data));
    // this.container.style.display = 'none';

    // this.container.classList.add('nullStatus');
    this.title = document.createElement('h2');
    // this.title.textContent = `${this.value} - ${this.lat}N, ${this.lon}E`;
    this.title.textContent = `${this.value}`;
    this.container.append(this.title);




    for (let label of Object.entries(this.data)) {
      console.log(label);
      this.p = document.createElement('p');

      this.container.classList.add('status');


      if ((Object.values(this.data["pm25"]) > 0) && (Object.values(this.data["pm25"])) < 51) {
        this.p.style.color = this.green;
        this.container.style.border = "3px solid" + this.green;
      } else if ((Object.values(this.data["pm25"]) >= 51) && (Object.values(this.data["pm25"])) < 100) {
        this.p.style.color = this.yellow;
        this.container.style.border = "3px solid" + this.yellow;
      } else if ((Object.values(this.data["pm25"]) >= 101) && (Object.values(this.data["pm25"])) < 150) {
        this.p.style.color = this.orange;
        this.container.style.border = "3px solid" + this.orange;
      } else if ((Object.values(this.data["pm25"]) >= 151) && (Object.values(this.data["pm25"])) < 200) {
        this.p.style.color = this.red;
        this.container.style.border = "3px solid" + this.red;
      }

      this.p.textContent = `${label[0]} : ${Object.values(label[1])}`;
      this.container.append(this.p);
    }

  }

  // setup() {

  // }
  // draw() {
  // }

}



class SaveButton {
  constructor(button, container) {
    this.button = button;
    this.container = container;
  }

  saveBtnCreation() {
    this.button.setAttribute("id", "saveButton");
    this.button.classList.add("saveButton");
    this.button.textContent = "\u{2913} Save";
    this.container.append(this.button);
  }
}



class InternalMemory {
  constructor(cityName, dataObj, outputData, selectElem) {
    this.cityName = cityName;
    this.dataObj = dataObj;
    this.outputData = outputData;
    this.select = selectElem;
    this.itemEqual;
  }



  saveData() {


    for (let label of Object.entries(this.outputData)) {
      this.dataObj[label[0]] = Object.values(label[1])[0];
    }

    localStorage[this.cityName] = JSON.stringify(this.dataObj);

    this.option = new Option(this.cityName, this.cityName, false, false);
    this.select.append(this.option);

  }

  // clearData() {
  //   localStorage.clear();
  // }
}

class LoadTab {
  constructor(data, value, containerElt) {
    this.data = data;
    // this.lat = latitude;
    // this.lon = longitude;
    this.value = value;
    this.container = containerElt;
    this.green = "#388E3C";
    this.yellow = "#FFEA00";
    this.orange = "#F57F17";
    this.red = "#E53935";
  }

  drawTab() {

    console.log(JSON.parse(this.data));

    let obj = JSON.parse(this.data);
    // this.container.classList.add('nullStatus');

    console.log(obj);

    console.log(Object.values(obj));

    // console.log(Object.values(this.data));
    // console.log(Object.entries(this.data));
    // this.container.style.display = 'none';

    this.container.classList.add('nullStatus');
    this.title = document.createElement('h2');
    // this.title.textContent = `${this.value} - ${this.lat}N, ${this.lon}E`;
    this.title.textContent = `${this.value}`;
    this.container.append(this.title);



    for (let elem of Object.entries(obj)) {
      console.log(elem);

      this.p = document.createElement('p');
      this.container.classList.add('status');


      if ((obj["pm25"] > 0) && (obj["pm25"]) < 51) {
        this.p.style.color = this.green;
        this.container.style.border = "3px solid" + this.green;
      } else if ((obj["pm25"] >= 51) && (obj["pm25"] < 100)) {
        this.p.style.color = this.yellow;
        this.container.style.border = "3px solid" + this.yellow;
      } else if ((obj["pm25"] >= 101) && (obj["pm25"] < 150)) {
        this.p.style.color = this.orange;
        this.container.style.border = "3px solid" + this.orange;
      } else if ((obj["pm25"] >= 151) && (obj["pm25"] < 200)) {
        this.p.style.color = this.red;
        this.container.style.border = "3px solid" + this.red;
      }

      this.p.textContent = `${elem[0]} : ${elem[1]}`;
      this.container.append(this.p);
    }





    /*

    for (let label of Object.entries(this.data)) {
      console.log(label);
      this.p = document.createElement('p');

      



      if ((Object.values(this.data["pm25"]) > 0) && (Object.values(this.data["pm25"])) < 51) {
        this.p.style.color = this.green;
        this.container.style.border = "3px solid" + this.green;
      } else if ((Object.values(this.data["pm25"]) >= 51) && (Object.values(this.data["pm25"])) < 100) {
        this.p.style.color = this.yellow;
        this.container.style.border = "3px solid" + this.yellow;
      } else if ((Object.values(this.data["pm25"]) >= 101) && (Object.values(this.data["pm25"])) < 150) {
        this.p.style.color = this.orange;
        this.container.style.border = "3px solid" + this.orange;
      } else if ((Object.values(this.data["pm25"]) >= 151) && (Object.values(this.data["pm25"])) < 200) {
        this.p.style.color = this.red;
        this.container.style.border = "3px solid" + this.red;
      }

      this.p.textContent = `${label[0]} : ${Object.values(label[1])}`;
      this.container.append(this.p);
    }

    */

  }

}

class retrieveAirDataByPos {
  constructor(lat, lon, airAPIKey) {
    this.lat = lat;
    this.lon = lon;
    this.air_api_key = airAPIKey;
  }
  async retrieve() {
    this.air_url = `https://api.waqi.info/feed/geo:${this.lat};${this.lon}/?token=${this.air_api_key}`;
    this.airResponse = await fetch(this.air_url);
    this.airJson = await this.airResponse.json();
    this.data = await this.airJson.data.iaqi;
  }
}