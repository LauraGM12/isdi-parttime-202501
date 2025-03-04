/* ¿Qué hace unshift() en JavaScript?
    La función nativa unshift() en JavaScript:
        - shift() elimina el primer elemento del array y devuelve ese elemento.
        - myShift() debe hacer lo mismo: modificar el array y devolver el valor */

var controlArray = ['qué', 'tal', '?'];
var testArray = ['qué', 'tal', '?'];
var elementToAdd = 'hola';
var controlLength;
var testLength;

// Ejecutar función nativa `unshift()`
controlLength = controlArray.unshift(elementToAdd);

// Ejecutar nuestra función `myUnshift()`
testLength = myUnshift(testArray, elementToAdd);

function myUnshift(arr, element) {
    for (var i = arr.length; i > 0; i--) {
        arr[i] = arr[i - 1]; // Desplazamos todos los elementos una posición a la derecha
    }
    arr[0] = element; // Insertamos el nuevo elemento al inicio
    return arr.length; // Devolvemos la nueva longitud del array
}


// TESTEO
console.info('running tests')

var lengthToTest = controlArray.length > testArray.length ? controlArray.length : testArray.length;

// Test 1: Verificar que los arrays sean iguales después de la operación
for (var i = 0; i < lengthToTest; i++) {
    console.assert(testArray[i] === controlArray[i], `index ${i} is different in both arrays. ${testArray[i]} !== ${controlArray[i]}`);
}

// Test 2: Verificar que devuelven la misma nueva longitud
console.assert(controlLength === testLength, `does not return the correct length. ${controlLength} !== ${testLength}`);
