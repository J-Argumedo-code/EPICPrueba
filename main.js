const palabras = ["computadora", "astronauta", "cometa", "casco"];
let intentosF = 0;


let pElegida = Array.from(palabras[Math.floor(Math.random() * palabras.length)]);

let espacios = document.getElementById("espacios");

let imagen = document.getElementById("img");

let longitud = pElegida.length;

console.log(pElegida)

window.addEventListener("load", () => {
    for (let i = 0; i < pElegida.length; i++) {
        espacios.insertAdjacentHTML("beforeend", `<h2 id="l${i}" class="mb-4 me-2 espacio">_</h2>`);
    }
});

document.getElementById("submit").addEventListener("click", () => {
    let letra = document.getElementById("letra").value;
    if (pElegida.indexOf(letra) !== -1) {
        alert("Si existe la letra");
        document.getElementById("l"+pElegida.indexOf(letra)).innerText = letra
    } else {
        alert("No existe la letra")
        intentosF++
    }
    switch (intentosF) {
        case 1:
            imagen.src = "resources/img/2.png"
            break;

        case 2:
            imagen.src = "resources/img/3.png"
            break;

        case 3:
            imagen.src = "resources/img/4.png"
            break;

        case 4:
            imagen.src = "resources/img/5.png"
            break;

        case 5:
            imagen.src = "resources/img/6.png"
            break;

    }
});