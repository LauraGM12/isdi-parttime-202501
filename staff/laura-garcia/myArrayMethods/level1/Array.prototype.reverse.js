var controlArray = ["uno", "dos", "tres","cuatro"]
var testArray = ["uno", "dos", "tres","cuatro"]
var controlElement
var testElement

console.log(controlArray);
controlElement = controlArray.reverse()


console.log(controlElement);

function myReverse(arr) {
    var left = 0;
    var right = arr.length - 1;

    while (left < right) {
        var temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        left++;
        right--;
    }

    return arr;
}

testElement = myReverse(testArray);
console.log(testArray)
console.info('running tests')

var lengthToTest = controlArray.length > testArray.length ? controlArray.length : testArray.length;

// Test 1: Verificar que los arrays sean iguales después de la operación
for (var i = 0; i < lengthToTest; i++) {
    console.assert(testArray[i] === controlArray[i], `index ${i} is different in both arrays. ${testArray[i]} !== ${controlArray[i]}`);
}

// Test 2: Verificar que devuelven el mismo elemento eliminado
    for (var i =0;  i < lengthToTest; i++) {
        console.assert(testElement[i]  === controlElement [i], `index ${i} is different in both arrays. ${testElement[i]} !== ${controlElement[i]}`);
    }
// Test 3: Que devuelva 'undefined' si el array está vacío.
console.assert([].reverse().length === myReverse([]).length, `should return undefined but returns: ${myReverse([])}`);