var choices = ['rock', 'paper', 'scissors'];
var playerChoise = "";
var computerChoise =  "";

var body = document.body;

/********************
   COMPUTER RANDOM CHOICE
*********************/
function getComputerChoise() {
    return choises[Math.floor(Math.random) * choices.length]
}


/*
    var img = document.createElement('img')

    img.src = 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/004.png'

    button.appendChild(img)
*/


// Crear una función que, pasada la elección hecha por el jugador ejecuta
// una decisión hecha al azar por el CPU
// luego de estas dos decisiones, se comparan y se elige quien gana
// cuando se sabe quien ha ganado, se le avisa de ello al usuario

//que se renderize feedback de lo que ha elegido el usuario y lo que ha
//elegido al azar por parte del cpu

/**********************
   BUTTON AND STYLES
***********************/

var gameTitle = document.createElement('h1');
gameTitle.textContent = 'Rock - Papper or Scissors';
gameTitle.style.textAlign = 'center';

function generateChoiceButton(_choice) {
    var button = document.createElement('button');
    button.textContent = _choice;
    button.style.backgroundColor = 'blue'
    button.style.color = 'white'
    button.style.padding = '10px 20px'
    button.style.border = 'black'
    button.style.borderRadius = '2px'
    button.addEventListener('click', function () {
        console.log(_choice)
    })
    body.appendChild(button);
}

for (var i = 0; i < choices.length; i++) {
    generateChoiceButton(choices[i])
}
