const api_key = "0e89f8a5d1213ff74ea2c9a7e44f7f40";

const api_key_geocoding = "07Xm7PKfZkdcTPzZqYfAPvCSb4ryjOsv";

const air_api_key = "0b73b1aca81b7059ece649c61736f3e6c21acb9e";

let input = document.querySelector('#insertInput');

let container = document.querySelector('#container');
console.log(container);

let data;

let selections = document.createElement('select');
selections.style.float = 'right';
container.append(selections);

let emptyOpt = new Option("Saved options...", "Saved options...", true, true);
selections.append(emptyOpt);

console.log(localStorage);


input.addEventListener('change', async () => {
	const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${api_key_geocoding}&location=${input.value}`;

	// Geocoding -----------------
	let response = await fetch(url);
	let json = await response.json();
	console.log(json);
	const lat = json.results[0].locations[0].latLng.lat;
	console.log(lat);
	const lon = json.results[0].locations[0].latLng.lng;
	console.log(lon);
	setTimeout(() => {
		input.value = ''
	}, 3000);
	// Geocoding -----------------

	// Air Quality -----------------

	const air_url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${air_api_key}`;

	let airResponse = await fetch(air_url);
	let airJson = await airResponse.json();
	console.log(airJson.data.iaqi);

	data = airJson.data.iaqi;

	makeTab(data, lat, lon);

	// Air Quality -----------------


	// Save Button ------------------
	let saveButton = document.createElement('button');
	saveButton.setAttribute("id", "saveButton");
	saveButton.textContent = "\u{2913} Save";
	saveButton.classList.add("saveButton");
	container.append(saveButton);
	console.log(saveButton);
	// Save Button ------------------

	saveButton.addEventListener('click', async () => {
		// Local Storage ----------------

		let sendingData = {};

		for (let label of Object.entries(data)) {
			console.log(Object.values(label[1]));
			sendingData[label[0]] = Object.values(label[1])[0];
		}

		console.log(sendingData);

		localStorage[json.results[0].providedLocation.location] = JSON.stringify(sendingData);

		// Local Storage ----------------




		// Added option ----------

		// makeOpt(selections);

		let insertValue = json.results[0].providedLocation.location;


		// console.log(selections.options.length);

		// for (let i = 0; i < selections.options.length; i++) {
		// 	if (selections.options[i].value !== insertValue) {
		// 		return;
		// 	} else {
		// 		let insertOpt = new Option(insertValue, insertValue, false, false);
		// 		selections.append(insertOpt);
		// 	}

		// 	// console.log(selections.options[i].value);
		// }

		// for (let i = 0; i < )

		// if (input.value == newOpt.value) {
		// 	continue;
		// } else {
		// 	selectElem.append(newOpt);
		// }

		// console.log(insertOpt);






		// let savedLabel = json.results[0].providedLocation.location;

		// console.log(localStorage.key(0));

		// console.log(savedLabel);

		// console.log(selections.options[0].value);

		// console.log(selections.options.length);

		// console.log(localStorage);

		// let newOptAdded = new Option(savedLabel, savedLabel, false, false);


		// console.log(newOptAdded.value);
		// console.log(selections.options.);

		// for (let i = 0; i < localStorage.length; i++) {
		// 	console.log(selections.options[i].value);
		// 	if (newOptAdded.value == selections.options[i].value) {
		// 		return;
		// 	} else {
		// 		selections.append(newOptAdded);
		// 	}
		// }

		// if(newOptAdded.value == selections.options)
		// selections.append(newOptAdded);

		// makeOpt(selections);


		// for (let i = 0; i < 5; i++) {

		// 	console.log(selections.options[i].value);


		// 	if (selections.options[i].value) {
		// 		return;
		// 	}


		// 	if (selections.options[i].value != savedLabel) {
		// 		console.log('Added');
		// 	} else {
		// 		return;
		// 	}
		// }



		// for (let elem of selections.options) {
		// console.log(elem.value);

		// console.log(localStorage.key(elem.value));

		// if (savedLabel !== localStorage.key(elem.value)) {
		// 	let newOpt = new Option(savedLabel, savedLabel, false, false);
		// 	selections.append(newOpt);
		// } else {
		// 	continue;
		// }

		// for (let i = 0; i < 5; i++) {
		// 	if (localStorage.key(i) == null) {
		// 		continue;
		// 	}
		// 	let savedOpt = new Option(localStorage.key(i), localStorage.key(i), false, false);
		// 	selections.append(savedOpt);
		// 	console.log(localStorage.key(i));

		// }

		// if (savedLabel == localStorage.key(elem.value)) {
		// 	return;
		// } else {
		// 	let newOpt = new Option(savedLabel, savedLabel, false, false);
		// 	selections.append(newOpt);
		// }
		// }







		// selections.append(savedOpt);
		// console.log(localStorage.key(i));


		// Added option ----------





	});

});

// console.log(data);


// localStorage.clear();

// console.log(localStorage.key(0));

// console.log(Object.keys(localStorage));

// console.log(JSON.parse(localStorage.Amsterdam));

// console.log(JSON.parse(localStorage.London));



if (localStorage.length > 0) {
	console.log('There are datas in memory');
	let savedDataOne = localStorage.key(0);
	console.log("savedDataOne: " + savedDataOne);
}

// selections

function makeOpt(selectElem) {
	for (let i = 0; i < localStorage.length; i++) {
		console.log(localStorage.key(i));

		let newOpt = new Option(localStorage.key(i), localStorage.key(i), false, false);
		// console.log('newOpt: ' + newOpt.value);
		// console.log('input: ' + input.value);
		if (input.value == newOpt.value) {
			continue;
		} else {
			selectElem.append(newOpt);
		}

	}
}

makeOpt(selections);

function makeTab(data, latitude, longitude) {
	let title = document.createElement('h2');
	title.textContent = `${input.value} - ${latitude}N, ${longitude}E`;
	container.append(title);

	let textColor;

	if ((Object.values(data["pm25"]) > 0) && (Object.values(data["pm25"])) < 51) {
		console.log("Green");
		textColor = "#388E3C";
	} else if ((Object.values(data["pm25"]) >= 51) && (Object.values(data["pm25"])) < 100) {
		console.log("Yellow");
		textColor = "#FFEA00";
	} else if ((Object.values(data["pm25"]) >= 101) && (Object.values(data["pm25"])) < 150) {
		console.log("Orange");
		textColor = "#F57F17";
	} else if ((Object.values(data["pm25"]) >= 151) && (Object.values(data["pm25"])) < 200) {
		console.log("Red");
		textColor = "#E53935";
	}

	for (let label of Object.entries(data)) {
		console.log(label);
		let p = document.createElement('p');
		p.style.color = textColor;
		p.textContent = `${label[0]} : ${Object.values(label[1])}`;
		container.append(p);

		// return console.log(label);
	}
}

selections.addEventListener('change', () => {
	console.log(selections.options[selections.selectedIndex].value);
	console.log(JSON.parse(localStorage[selections.options[selections.selectedIndex].value]));
});