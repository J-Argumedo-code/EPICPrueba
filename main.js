// Declaración de variables
let nombre = '';

let intentosF = 0,
    intentosC = 0,
    juegosG = 0,
    juegosP = 0,
    pElegida = '';

let letrasIntentadas = [];

const espacios = document.getElementById("espacios"),
    imagen = document.getElementById("img"),
    letra = document.getElementById("letra");

let mensaje = document.getElementById("mensaje2");


// Método manejador de eventos que se ejecuta cuando se envía el formulario de inicio
document.getElementById("inicioForm").addEventListener("submit", (e) => {
    // Se evita recargar la página web después de enviar el formulario.
    e.preventDefault();
    // Se declara la expresión regular a utilizar en la validación
    let regex = /^[a-zA-ZñÑ]{1,20}$/;
    // Se verifica que el dato ingresado coincida con la expresión regular
    if (!regex.exec(document.getElementById("nombre").value)) {
        mostrarMensaje("incorrecto", "Nombre no válido", true);
    } else {
        // En caso la validación sea correcta se guarda el nomrbe y se muestra la pantalla del juego 
        nombre = document.getElementById("nombre").value;
        document.getElementById("mensajeNombre").innerText = `¡Suerte ${nombre} adivinando la palabra!`;

        document.getElementById("cont1").classList.add("left");
        document.getElementById("cont2").classList.add("left");
        // Se manda a llamar la función para generar una nueva palabra aleatoria
        generarPalabra();
        // Se recupera el progeso de juegos ganados y perdidos del LocalStorage (en caso sea null se define como 0)
        juegosG = (localStorage.getItem("juegosG")) ? localStorage.getItem("juegosG") : 0;
        juegosP = (localStorage.getItem("juegosP")) ? localStorage.getItem("juegosP") : 0;
        document.getElementById("ganados").innerText = "Juegos ganados: " + juegosG;
        document.getElementById("perdidos").innerText = "Juegos perdidos: " + juegosP;
    }
});


// Función para generar una nueva palabra aleatoria a adivinar
function generarPalabra() {
    // Url al cual se hará la petición de la palabra
    fetch('https://clientes.api.greenborn.com.ar/public-random-word', {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON
            request.json().then(function (response) {
                // Se define un array con la palabra obtenida y se generan los espacios respectivos
                pElegida = Array.from(response[0]);
                //console.log(pElegida.join(''));
                espacios.innerHTML = "";
                for (let i = 0; i < pElegida.length; i++) {
                    espacios.insertAdjacentHTML("beforeend", `<h2 id="l${i}" class="mb-4 me-2 espacio">_</h2>`);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
};


// Método manejador de eventos que se ejecuta cuando se presiona una tecla en el input de letra
letra.addEventListener("keypress", (e) => {
    // Validación para evitar el ingreso de más de 1 caracter por medio del teclado
    if (letra.value.length === 1) {
        e.preventDefault();
    }
});


// Método manejador de eventos que se ejecuta cuando se presiona el botón de comprobar letra
document.getElementById("comprobarLetraBtn").addEventListener("click", () => {
    // Se define la expresión regular a utilizar
    let regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]{1}$/;
    // Se verifica si el juego ya ha finalizado
    if (intentosF === 6 || intentosC === pElegida.length) {
        reiniciarJuego();
    } else if (!regex.exec(letra.value)) {
        // Se valida que el dato ingresado coincida con la expresión regular
        mostrarMensaje("incorrecto", "Ingrese una letra");
    } else if (letrasIntentadas.indexOf(letra.value.toLowerCase()) !== -1) {
        // Se verifica si la letra ingresada no se ha ingresado con anterioridad
        mostrarMensaje("incorrecto", "Ya ha probado con esa letra, intente otra letra");
    } else {
        // Si todo está correcto se realiza la comprobación de la letra ingresada
        comprobarLetra();
    }
    // Se vacía el input de letra
    letra.value = "";
});


// Función para comprobar si la letra ingresada existe en la palabra generada aleatoriamente
function comprobarLetra() {
    // Se obtiene el valor de la letra ingresada en minúscula
    let letraI = letra.value.toLowerCase();
    // Se guarda en un array le letra ingresada para llevar el registro
    letrasIntentadas.push(letraI);

    // Se verifica si la letra ingresada existe en la palabra a adivinar
    if (pElegida.indexOf(letraI) !== -1) {
        // En caso de existir la letra se muestra un mensaje de felicitación
        mostrarMensaje("correcto", "Correcto! La letra forma parte de la palabra");
        // Además se revela la posición y repeticiones existentes de la letra en la palabra a adivinar
        let idx = pElegida.indexOf(letraI);
        while (idx != -1) {
            document.getElementById("l" + idx).innerText = letraI;
            idx = pElegida.indexOf(letraI, idx + 1);
            intentosC++;
        }
        // Si ya ha adivinado la palabra se le notifica que ha ganado el juego y se le ofrece reiniciarlo
        if (intentosC === pElegida.length) {
            mostrarMensaje("correcto", `Felicidades ${nombre}! Has adivinado la palabra`);
            imagen.src = "resources/img/8.png";
            document.getElementById("comprobarLetraBtn").innerText = "Reiniciar";
            juegosG++;
            localStorage.setItem("juegosG", juegosG);
            document.getElementById("ganados").innerText = "Juegos ganados: " + juegosG;
        }
    } else {
        // En caso que la letra no exista se muestra un mensaje de fallo
        mostrarMensaje("incorrecto", "Incorrecto, la letra no forma parte de la palabra");
        // Se aumenta el contador de intentos fallidos
        intentosF++;

        // Switch para el cambio de imagen respecto a la cantidad de intentos fallidos
        switch (intentosF) {
            case 1:
                imagen.src = "resources/img/2.png";
                break;

            case 2:
                imagen.src = "resources/img/3.png";
                break;

            case 3:
                imagen.src = "resources/img/4.png";
                break;

            case 4:
                imagen.src = "resources/img/5.png";
                break;

            case 5:
                imagen.src = "resources/img/6.png";
                break;

            case 6:
                imagen.src = "resources/img/7.png";
                break;

            default:
                break;
        }

        // Si los intentos fallidos llega a 6 se notifica que ha perdido el juego y se ofrece reiniciarlo
        if (intentosF === 6) {
            mostrarMensaje("incorrecto", `Rayos! Has perdido, la palabra era: ${pElegida.join('')}, vuelve a intentar`);
            document.getElementById("comprobarLetraBtn").innerText = "Reiniciar";
            juegosP++;
            localStorage.setItem("juegosP", juegosP);
            document.getElementById("perdidos").innerText = "Juegos perdidos: " + juegosP;
        }
    }
};


// Función para el reinicio de todos los datos necesarios del juego
function reiniciarJuego() {
    generarPalabra();

    letrasIntentadas = [];

    document.getElementById("comprobarLetraBtn").innerText = "Intentar";
    intentosF = 0;
    intentosC = 0;
    mensaje.classList.remove("correcto");
    mensaje.classList.remove("incorrecto");
    mensaje.classList.add("oculto");
    imagen.src = "resources/img/1.png";
};


/* 
*   Función para mostrar mensajes personalizados al usuario
*   Parametros: add (Clase a agregar al mensaje), message (texto a mostrar en el mensaje), 
*   msg1 (variable en el caso se deba mostrar un mensaje en la primera pantalla de la aplicación).
*/
function mostrarMensaje(add, message, msg1) {
    (msg1) ? mensaje = document.getElementById("mensaje1") : "";
    // Amnimación del mensaje
    mensaje.classList.remove("correcto");
    mensaje.classList.remove("incorrecto");
    mensaje.classList.add("oculto");
    setTimeout(() => {
        mensaje.classList.remove("oculto");
        mensaje.classList.add(add);
        // Se define el texto a mostrar
        mensaje.innerText = message;
    }, 1)
};
