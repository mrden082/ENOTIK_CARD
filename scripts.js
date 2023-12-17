"use strict";
const api_url = "https://visioncraftapi--vladalek05.repl.co";
const api_key = "a1b58ede-2f6f-4167-b67b-b2608b948198";
const model = "absolutereality_v1.8.1";
const sampler = "LMS";
const image_count = 1;
const cfg_scale = 8;
const steps = 30;
const loras = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2, "eye_size_slider_v1": 3, "age_slider_v20": 1, };
let enots = [];
const selectElement = document.querySelector('select');
const cardElement = document.querySelector('.select');
selectElement.addEventListener('change', function () {
    const selectedValue = selectElement.value;
    let selectedData = '';
    if (selectedValue === 'name') {
        selectedData = enots.map(enot => enot.name).join(', ');
    }
    else if (selectedValue === 'age') {
        selectedData = enots.map(enot => enot.age).join(', ');
    }
    else if (selectedValue === 'height') {
        selectedData = enots.map(enot => enot.height).join(', ');
    }
    else if (selectedValue === 'weight') {
        selectedData = enots.map(enot => enot.weight).join(', ');
    }
    //   else if (selectedValue === 'prompt') {
    //     // selectedData = enots.map(enot => enot.prompt).join(', ');
    //   }
    cardElement.textContent = selectedData;
});
function generateEnot(data, callback) {
    const button = document.getElementById('buttonenotik');
    const spinner = button.querySelector('.submit-spinner');
    button.disabled = true;
    spinner.classList.remove('submit-spinner_hide');
    fetch(`${api_url}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(body => {
        const image_url = body.images[0];
        const { name, age, height, weight } = data;
        const enot = {
            prompt: data.prompt,
            name: name,
            age: age,
            height: height,
            weight: weight,
            image: image_url,
        };
        enots.push(enot);
        saveEnotsToLocalStorage();
        callback(enot);
    })
        .catch(error => {
        console.error("Error generating images: ", error);
    })
        .finally(() => {
        button.disabled = false;
        spinner.classList.add('submit-spinner_hide');
    });
}
function saveEnotsToLocalStorage() {
    localStorage.setItem('enots', JSON.stringify(enots));
}
function getEnotsFromLocalStorage() {
    const enotsData = localStorage.getItem('enots');
    if (enotsData) {
        enots = JSON.parse(enotsData);
    }
}
const buttonGenerate = document.getElementById('buttonenotik');
buttonGenerate.addEventListener("click", () => {
    const nameInput = document.getElementById('ENOT');
    const ageInput = document.getElementById('age');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const name = nameInput.value;
    const age = ageInput.value;
    const height = heightInput.value;
    const weight = weightInput.value;
    const prompt = `Draw a beautiful cute raccoon by <br> name ${name} and he is this <br> tall ${height} metre, weight ${weight} kilogram, <br> and so old ${age}.`;
    const data = {
        model,
        sampler,
        prompt,
        negative_prompt: '',
        image_count,
        token: api_key,
        cfg_scale,
        steps,
        loras,
        name,
        age,
        height,
        weight,
    };
    generateEnot(data, (enot) => {
        const { name, age, weight, height, image } = enot;
        let card = document.getElementById('card');
        const table = document.createElement('table');
        const row = table.insertRow();
        const enotikCell = row.insertCell(0);
        enotikCell.rowSpan = 2;
        enotikCell.innerHTML = `Енотик: <br> имя - ${name}; <br> рост - ${height}; <br> вес - ${weight}; <br> возраст - ${age}`;
        const imageCell = row.insertCell(1);
        const imageElement = document.createElement('img');
        imageElement.src = image;
        imageElement.alt = `Енотик ${name}`;
        imageCell.appendChild(imageElement);
        card.appendChild(table);
    });
});
const clearLocalStorageButton = document.getElementById('clearLocalStorageButton');
const buttonHistory = document.getElementById('buttonHistory');
if (clearLocalStorageButton) {
    clearLocalStorageButton.addEventListener('click', function () {
        localStorage.clear();
    });
}
buttonHistory.addEventListener('click', () => {
    let card = document.getElementById('card');
    card.innerHTML = '';
    enots.forEach((enot) => {
        const { prompt, name, age, height, weight, image } = enot;
        const table = document.createElement('table');
        const row1 = table.insertRow();
        const row2 = table.insertRow();
        // const promptCell = row1.insertCell(0);
        // promptCell.colSpan = 2;
        // promptCell.textContent = `Промт: ${prompt}`;
        const enotikCell = row2.insertCell(0);
        enotikCell.rowSpan = 2;
        enotikCell.innerHTML = `Енотик: <br> имя - ${name}; <br> рост - ${height}; <br> вес - ${weight}; <br> возраст - ${age}`;
        const imageCell = row2.insertCell(1);
        const imageElement = document.createElement('img');
        imageElement.src = image;
        imageElement.alt = `Енотик ${name}`;
        imageCell.appendChild(imageElement);
        card.appendChild(table);
    });
});
getEnotsFromLocalStorage();
