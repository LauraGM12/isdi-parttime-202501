/* ¿Qué hace shift() en JavaScript?
    La función nativa shift() en JavaScript:
        - shift() elimina el primer elemento del array y devuelve ese elemento.
        - myShift() debe hacer lo mismo: modificar el array y devolver el valor */


var controlArray = ['hola', 'qué', 'tal', '?'];
var testArray = ['hola', 'qué', 'tal', '?'];
var controlElement;
var testElement;

// Ejecutar función nativa `shift()`
controlElement = controlArray.shift();

// Ejecutar mi función `myShift()`
testElement = myShift(testArray);

//Función
function myShift(arr) {
    if (arr.length === 0) return undefined; // Si el array está vacío, devolver undefined

    var value = arr[0]; // Guardamos el primer elemento
    for (var i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1]; // Desplazamos todos los elementos una posición a la izquierda
    }
    arr.length = arr.length - 1; // Reducimos la longitud del array
    return value; // Devolvemos el primer elemento eliminado
}

//TESTEO
/* ¿Qué hacemos en el testeo?
    El testeo verifica tres cosas importantes:
        - Que los arrays sean iguales después de la operación.
        - Que devuelvan el mismo valor eliminado.
        - Que devuelvan undefined si el array está vacío.
    IMPORTANTE: Si todos los tests pasan, significa que myShift() se comporta igual que shift().*/

    console.info('running tests')

var lengthToTest = controlArray.length > testArray.length ? controlArray.length : testArray.length;

// Test 1: Verificar que los arrays sean iguales después de la operación
for (var i = 0; i < lengthToTest; i++) {
    console.assert(testArray[i] === controlArray[i], `index ${i} is different in both arrays. ${testArray[i]} !== ${controlArray[i]}`);
}

// Test 2: Verificar que devuelven el mismo elemento eliminado
console.assert(controlElement === testElement, `does not return the correct value. ${controlElement} !== ${testElement}`);

// Test 3: Que devuelva 'undefined' si el array está vacío.
console.assert([].shift() === myShift([]), `should return undefined but returns: ${myShift([])}`);

/*¿Qué comprobamos en cada test?
1- El for que compara los arrays
    - Asegura que después de eliminar el último elemento, testArray y controlArray sean idénticos.
    - Si falla, significa que myShift() no eliminó correctamente el último elemento.
2- console.assert(controlElement === testElement, ...)
    - Verifica que ambas funciones devuelvan el mismo elemento eliminado.
    - Si falla, significa que myShift() no está devolviendo el valor correcto.
3- console.assert([].shift() === myShift([]), ...)
    - Asegura que si el array está vacío, ambas funciones devuelvan undefined.
    - Si falla, significa que myShift([]) no maneja bien los arrays vacíos.*/