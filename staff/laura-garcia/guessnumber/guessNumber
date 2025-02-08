function guessNumber() {
    var winNumber = Math.floor(Math.random() *10) + 1 //Math.random() *10: Genera un número entre 0 y 9.999... - Math.floor(): Redondea hacia abajo (número entero entre  0 y 9) - +1: Ajusta el rango para obtener  valores  entre  1 y 10
    var guess;
    var attempts = 0;


    while (guess !== winNumber) {
        guess = prompt('¿Puedes adivinar en que número estoy pensando? (1-10)');
        
     
        if (guess === null || guess === '') {
            alert('Por favor, ingresa un número válido.');
            continue; 
        }


        guess = parseInt(guess);


        if (isNaN(guess) || guess < 1 || guess > 10) {
            alert('Por favor, ingresa un número entre 1 y 10.');
            continue;          }


        attempts++;

 
        if (guess === winNumber) {
            alert('¡Enhorabuena! Has adivinado el número en ' + attempts + ' intentos.');
        } else {
            alert('Inténtalo de nuevo.');
        }
    }
}

guessNumber();
