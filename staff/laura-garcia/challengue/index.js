var choices = ['rock', 'paper', 'scissors'];
var body = document.body;
var playerChoice = "";
var computerChoice =  "";

/*COMPUTER RANDOM CHOICE*/
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

/*TITTLE*/

var gameTitle = document.createElement('h1');
gameTitle.textContent = 'Rock - Paper or Scissors';
gameTitle.style.textAlign = 'center';
gameTitle.style.color = '#131e29'
body.appendChild(gameTitle);

/*DISPLAY*/
var resultDiv = document.createElement('div');
resultDiv.style.textAlign = 'center';
resultDiv.style.marginTop = '20px';
resultDiv.style.fontSize = '24px';
body.appendChild(resultDiv);

/*CONTAINER BUTTONS*/
var buttonContainer = document.createElement('div');
buttonContainer.style.textAlign = 'center';
buttonContainer.style.marginTop = '20px';
body.appendChild(buttonContainer);

/*BUTTON GENERATION*/
function generateChoiceButton(choice) {
    var button = document.createElement('button');
    button.textContent = choice;
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.margin = '5px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', function () {
        playerChoice = choice;
        computerChoice = getComputerChoice();
        playWinner();
    });

    buttonContainer.appendChild(button);
}

/*Generate button */
for (var i = 0; i < choices.length; i++) {
    generateChoiceButton(choices[i]);
}



/*WINNER*/

function playWinner() {
    var resultMessage = `Has elegido: <b>${playerChoice}</b><br>La máquina ha eligido: <b>${computerChoice}</b><br>`;

    if (playerChoice === computerChoice) {
        resultMessage += `¡Es un empate!`;
    } else if (
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        resultMessage += `¡Has ganado!`;
    } else {
        resultMessage += `¡Has perdido!`;
    }
    
    resultDiv.innerHTML = resultMessage;
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