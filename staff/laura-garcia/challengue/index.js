var choices = ['Piedra', 'Papel', 'Tijera'];
var body = document.body;
var computerChoice = ""; //cpu
var playerChoice = ""; //jugador
var roundsPlayed = 0; //rounds 
var playerScore = 0; //player win ¿¿??
var computerScore = 0; //computer win  ¿¿??
var playerLive = 2;  
var computerLive = 2;
var maxRounds = 3;
var currentRounds  = 1;


/*Elección aleatoria del CPU*/
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

/*Título*/
var gameTitle = document.createElement('h1');
gameTitle.textContent = 'Piedra Papel o Tijera - Mejor de 3';
gameTitle.style.textAlign = 'center';
gameTitle.style.color = '#131e29';
body.appendChild(gameTitle);



/*Display de los puntos*/
var scoreDiv = document.createElement('div');
scoreDiv.style.textAlign = 'center';
scoreDiv.style.marginTop = '10px';
scoreDiv.style.fontSize = '20px';
body.appendChild(scoreDiv);

/*Display de  las rondas*/
var roundDiv = document.createElement('div');
roundDiv.style.textAlign = 'center';
roundDiv.style.marginTop = '10px';
roundDiv.style.fontSize = '18px';
body.appendChild(roundDiv);

/*Display de los resultados*/
var resultDiv = document.createElement('div');
resultDiv.style.textAlign = 'center';
resultDiv.style.marginTop = '20px';
resultDiv.style.fontSize = '24px';
body.appendChild(resultDiv);

/*Contenedor de los botones*/
var buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'row';
buttonContainer.style.justifyContent = 'center';
buttonContainer.style.padding = '2em';
body.appendChild(buttonContainer);

/*Generación de los botones*/
function generateChoiceButton(choice) {
    var button = document.createElement('button');
    button.textContent = choice;
    button.style.backgroundColor = '#FA7E61';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '1rem';
    button.style.margin = '5px';
    button.style.cursor = 'pointer';
    button.style.width = '20rem';
    button.addEventListener('click', function() {
        if (roundsPlayed < 3) {
            playerChoice = choice;
            computerChoice = getComputerChoice();
            playRound();
        }
    });
    buttonContainer.appendChild(button);
}

/*Generate buttons*/
for (var i = 0; i < choices.length; i++) {
    generateChoiceButton(choices[i]);
}

/*PLAY ROUND*/
function playRound() {
    roundsPlayed++;
    var roundResult = "";
    var gameResult = "";

// ¿Quién gana?
if (playerChoice === computerChoice) {
    roundResult = "¡Es un empate!";
} else if (
    (playerChoice === 'Papel' && computerChoice === 'Piedra') ||
    (playerChoice === "Piedra" && computerChoice === "Tijera") ||
    (playerChoice === "Tijera" && computerChoice === "Papel")
) {
    playerScore++;
    roundResult = "¡Has ganado esta ronda!";
} else {
    computerScore++;
    roundResult = "¡Has perdido esta ronda!";
}

// Texto de resultado rondas y ganadores
    roundDiv.innerHTML = `Ronda ${roundsPlayed}/3`;
    scoreDiv.innerHTML = `Jugador: ${playerScore} | CPU: ${computerScore}`;
    
    var resultMessage = `Eliges: ${playerChoice}<br>
                        CPU: ${computerChoice}<br>
                        ${roundResult}`;

// ¿hay ya 3 rondas?
if (roundsPlayed === 3) {
    if (playerScore > computerScore) {
        resultMessage="";
        gameResult = "<br><br>¡FELICIDADES! Has ganado";
    } else if (computerScore > playerScore) {
        resultMessage="";
        gameResult = "<br><br>¡Game Over!La CPU ha ganado!";
    } else {
        resultMessage="";
        gameResult = "<br><br>¡El juego ha terminado en empate!";
    }

}

    resultDiv.innerHTML = resultMessage + gameResult;
}

