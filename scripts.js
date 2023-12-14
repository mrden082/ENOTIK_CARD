"use strict";
const api_url = "https://visioncraftapi--vladalek05.repl.co";
const api_key = "a1b58ede-2f6f-4167-b67b-b2608b948198";
const model = "anything_V5";
const sampler = "Euler";
const image_count = 3;
const cfg_scale = 8;
const steps = 30;
const loras = { "3DMM_V12": 1, "GrayClay_V1.5.5": 2 };
function generateEnot(data, callback) {
    fetch(`${api_url}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(body => {
        const image_url = body.images[0]; // Предполагаем, что вернется одна картинка
        const { name, age, height, weight } = data;
        const enot = {
            promt: data.prompt,
            name: name,
            age: age,
            height: height,
            weight: weight,
            image: image_url,
        };
        callback(enot);
    })
        .catch(error => {
        console.error("Error generating images: ", error);
    });
}
const button = document.getElementById('buttonenotik');
button === null || button === void 0 ? void 0 : button.addEventListener("click", () => {
    const name = document.getElementById('ENOT').value;
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const promt = `Draw a beautiful cute raccoon by name ${name} and he is this tall ${height} metre, weight ${weight} kilogram, and so old ${age}.`;
    const data = {
        model,
        sampler,
        prompt: promt,
        negative_prompt: '',
        image_count,
        token: api_key,
        cfg_scale,
        steps,
        loras,
        name: name,
        age: age,
        height: height,
        weight: weight,
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
        imageCell.appendChild(imageElement);
        card.appendChild(table);
    });
});
