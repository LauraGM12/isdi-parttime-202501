/* ¿Qué hace pop() en JavaScript?
    La función nativa pop() en JavaScript:
        - pop() elimina el último elemento del array y devuelve ese elemento.
        - myPop() debe hacer lo mismo: modificar el array y devolver el valor eliminado. */

var controlArray = ['hola', 'qué', 'tal', '?'];
var testArray = ['hola', 'qué', 'tal', '?'];
var controlElement;
var testElement;

//Ejecutar función nativa js
controlElement = controlArray.pop();


/*Crear mi función FLORS
function myPop(arr) {
    if (arr.length === 0) return undefined

    var value = arr[arr.length - 1] // Guardamos el último elemento
    --arr.length //Esto no elimina el elemento del array
    return value
}*/

//Función corregida
function myPop(arr) {
    if (arr.length === 0) return undefined; //  Si el array está vacío, devolver undefined

    return arr.splice(-1, 1)[0]; // Elimina y devuelve el último elemento (repasar)
}



//Ejecutar mi funcion
testElement = myPop(testArray)




//TESTEO
/* ¿Qué hacemos en el testeo?
    El testeo verifica tres cosas importantes:
        - Que los arrays sean iguales después de la operación.
        - Que devuelvan el mismo valor eliminado.
        - Que devuelvan undefined si el array está vacío.
    IMPORTANTE: Si todos los tests pasan, significa que myPop() se comporta igual que pop().*/


console.info('running tests')

var lengthToTest = controlArray.length > testArray.length ? controlArray.length : testArray.length;

// Test 1: Verificar que los arrays sean iguales después de la operación
for (var i = 0; i < lengthToTest; i++) {
    console.assert(testArray[i] === controlArray[i], `index ${i} is different in both arrays. ${testArray[i]} !== ${controlArray[i]}`);
}

// Test 2: Verificar que devuelven el mismo elemento eliminado
console.assert(controlElement === testElement, `does not return the correct value. ${controlElement} !== ${testElement}`);

// Test 3: Que devuelva 'undefined' si el array está vacío.
console.assert([].pop() === myPop([]), `should return undefined but returns: ${myPop([])}`);


/*¿Qué comprobamos en cada test?
1- El for que compara los arrays
    - Asegura que después de eliminar el último elemento, testArray y controlArray sean idénticos.
    - Si falla, significa que myPop() no eliminó correctamente el último elemento.
2- console.assert(controlElement === testElement, ...)
    - Verifica que ambas funciones devuelvan el mismo elemento eliminado.
    - Si falla, significa que myPop() no está devolviendo el valor correcto.
3- console.assert([].pop() === myPop([]), ...)
    - Asegura que si el array está vacío, ambas funciones devuelvan undefined.
    - Si falla, significa que myPop([]) no maneja bien los arrays vacíos.*/