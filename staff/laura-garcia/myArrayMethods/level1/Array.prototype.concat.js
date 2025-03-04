//Método Concat//
//El método concat añade un array a otro existente. Funciona de forma similar a la función appendChild de html. Siempre mantendrá el orden lógico, empezará por al array names, y continuará con el array names2//
//Procedimiento de comprobación TDD//

//DECLARAMOS LAS VARIABLES A CONSIDERAR PARA REALIZAR LAS COMPROBACIONES//
var names = ['Juan', 'Diana', 'Sonia', 'Marta'] //Declaramos variable con array original//
var names2 = ['Juanjo', 'Francisco', 'David', 'Marco'] //Declaramos variable con el array que queremos concatenar//
var testNames = ['Juan', 'Diana', 'Sonia', 'Marta'] //Declaramos variable de test con los elementos del array original//
var testNames2 = ['Juanjo', 'Francisco', 'David', 'Marco'] //Declaramos variable de test con los elementos del array que queremos concatenar//


//DECLARAMOS UNA FUNCIÓN QUE REALIZARÍA, DE MANERA MANUAL, EL MÉTODO CONCAT//
function myConcat(array1, array2) { //La función realizaría un concat de forma manual, añadiendo los elementos de un array a otro//
    if (array1.length === 0 && array2.length === 0) return undefined //El if nos indica que si la longitud de los arrays 1 y 2 es 0 (es decir, no hay nada), nos devuelve indefinido (undifined)//
    var concat = []  //Declaramos variable concat, donde almacenaremos los elementos de array1 y array2//
    for (var i = 0; i < array1.length; i++) { //El for itera los elementos del array1//
        concat[concat.length] = array1[i] //Para posteriormente, indicar que la longitud de la variable concat, es igual al índice recorrido en el for del array1//
    }
    for (var j = 0; j < array2.length; j++) { //El for itera los elementos del array2. Iteramos con un índice diferente, para que ambos array se almacenen de forma independiente//
        concat[concat.length] = array2[j] //Para posteriormente, indicar que la longitud de la variable concat, es igual al índice recorrido en el for del array2//
    }
    return concat //Devolvemos el valor de concat//
}


//DECLARAMOS LAS VARIABLES DE CONTROL PARA REALIZAR LAS COMPROBACIONES//
var controlResult1 = testNames.concat(testNames2) //Declaramos primera variable de control, donde realizamos el concat de testeo sobre el array de testeo. Devolvería el array concatenado por orden (primero testNames y a continuación testNames2//
var controlResult2 = myConcat(names, names2) //Declaramos la segunda variable de control, donde aplicaremos el concat original sobre el array original, a través de nuestra función manual. Devolvería el array concatenado por orden (primero names y a continuación names2//


//VALIÉNDONOS DE LA FUNCION CONSOLE.ASSERT, REALIZAMOS POR DOS VÍAS LAS COMPROBACIONES PERTINENTES, PARA AVERIGUAR SI AMBOS TEST SON SUPERADOS, O SI POR CONTRA, DEBEMOS MODIFICARLOS//
console.assert(controlResult1 === controlResult2, 'ambos controles devuelven lo mismo. El código es correcto')
for (var i = 0; i < controlResult1.length; i++) { //El for itera todos los elementos de la longitud de controlResult1//
    console.assert(controlResult1[i] === controlResult2[i], `la posición ${i} es diferente en ambos arrays. ${testNames[i]} !== ${names[i]}`); //Con este assert comprobamos los índices de controlResult1 y de controlResult2. Si son iguales, no lanzará ningún mensaje, pero si hay diferencias en algúna posición, las arrojaría en el mensaje escrito en consola//
}

//POR ÚLTIMO, REALIZAMOS LOS CONSOLE LOG DE CADA UNO DE LOS PARÁMETROS (NAMES, TESTNAMES, CONTROLRESULT1 Y CONTROLRESULT2, PARA COMPROBAR QUE NOS ARROJAN EN CONSOLA//
console.log(names) //Devuelve en consola el array original//
console.log(testNames) //Devuelve en consola el array de test//
console.log(names2) //Devuelve en consola el array original a concatenar//
console.log(testNames2) //Devuelve en consola el array de test a concatenar//
console.log(controlResult1) //Devuelve en consola un único array fusionado, que contiene, por order, el array testNames y el array testeNames2//
console.log(controlResult2) //Devuelve en consola un único array fusionado, que contiene, por order, el array de names y el array de names2//
