# Challenge React  

## Importante  
- Durante este challenge, solo tienes que fijarte en `App.jsx` y en los distintos componentes `.jsx` dentro de la carpeta `components`.  
- No te entretengas editando estilos ni complicándote la vida añadiendo más componentes.  
- En el código hay comentarios que indican en qué paso toca editar cada línea; no los borres antes de tiempo.  
- Los componentes `Form.jsx` y `Btn.jsx` no necesitan ser editados para este challenge, pero sí debes fijarte en cómo funcionan por dentro.  
- Sigue el paso a paso, busca en Google pistas extra y, si sigues sin poder avanzar, pide ayuda.  

## Completar el challenge en 10 pasos (el 9 te sorprenderá)  

### 1. Familiarízate con lo que hay hecho hasta ahora  
- Tenemos `App.jsx`, donde se debería manejar qué se muestra en pantalla y donde podemos centralizar qué funciones y variables enviamos a otros componentes.  
- En la carpeta `components` hay una serie de componentes para renderizar la esencia de esta app:  
  - `Btn.jsx`: sirve para mostrar un botón con un contenido específico y que ejecuta una acción concreta al hacer clic.  
  - `Form.jsx`: se usa para crear formularios; espera recibir un array de inputs (objetos con `type`, `placeholder`, `id`) y un callback que maneje el `submit` del formulario.  
  - `List.jsx`: renderiza listas y añade un botón para eliminar cada uno de los elementos de esa lista. Espera recibir la lista a iterar y la función para eliminar items en base al índice.  

Fíjate en que los componentes funcionales esperan un parámetro en forma de objeto con una serie de variables. Esos son los `props`. Tendremos que determinar el valor de estas variables cada vez que llamemos al componente para renderizarlo. En muchos casos, se espera un `className` puramente estético, que sería un string con la clase CSS, pero también pueden necesitar callbacks, strings, arrays, etc. Para entenderlo mejor, revisa concretamente el caso del `<Btn>` dentro de `List.jsx` y curiosea los [docs de react](https://react.dev/learn/passing-props-to-a-component).

Los `props` son como una pirámide de copas de champán en una fiesta elegante: para que el champán llegue a las copas de abajo, primero tienes que verterlo desde la copa de arriba que comparten en común. En esta pirámide de copas, el champán fluye de arriba hacia abajo enviando estados (variables) como `props`. En cambio, de abajo hacia arriba, desafiamos las leyes de la gravedad usando funciones.  

En `List.jsx`, puedes ver que la información que recibe desde `App.jsx` para renderizar es el `prop` "items" (que se espera que sea un array). Además, recibe una función llamada "onItemClick", que sirve para enviar a `App.jsx` el índice del item que ha sido clicado. La función que creemos en `App.jsx` decidirá qué hacer con ese índice.  

### 2. Mostrar o no una cosa u otra en base a un estado  

¡Basta de mirar, toca escribir código! Vuelve a `App.jsx`. Ahora mismo, si miras en Chrome la app, solo verás un formulario que no hace nada y un botón que tampoco hace nada. Es hora de añadirle funcionalidad.  

### 3. Añadir el formulario  

Esos `<p>` que hay en `App.jsx` tienen que eliminarse y reemplazarse por algunos de los componentes ya creados. Empecemos por el formulario.  

Para llamar a un componente y añadirle `props`, fíjate en cómo se está llamando el `<Btn>` en `App.jsx`... replica el proceso, pero llamando a `<Form>`.  

Ahora toca ajustar los `props` que vamos a pasarle:  
- `inputs`: Se espera que sea un array de objetos, por ejemplo:  
  ```js
  [{ type: 'number', placeholder: 'Nuevo número', id: 'number', className: 'input' }]
  ```
  Si el propósito es añadir una palabra, crea el array con un input acorde a ello. Ten en cuenta que con el valor que le des a `"id"`, accederás luego al input que complete el usuario.  
- `onSubmitCallback`: Es la función que se ejecuta cuando se envía el formulario. En este caso, ya existe una función llamada `handleSendNewWord` para ello (aunque todavía está incompleta).  
- `submitText`: Un string con el texto que mostrará el botón de submit, por ejemplo, `"Guardar"`.  
- `className`: El estilo que se le dará al formulario. Ya hay una clase creada llamada `"form"`, aprovéchala.  

Si pasas estos `props` correctamente, se mostrará el formulario y, además, cuando envíes un valor, se hará un `console.log` con la respuesta ingresada en el input.  

### 4. Hacer que el formulario haga lo que debe al enviar  
- Vamos a guardar la palabra en el `localStorage`. El objeto `data` ya tiene las funciones necesarias para ello, solo toca usarlas correctamente en la función `"handleSendNewWord"`. Llama al método `data.words.addNew()` y pásale como parámetro la palabra a añadir.  
- Luego, hay que hacer que, una vez enviado el formulario, este desaparezca y se muestre el otro párrafo (que en un futuro será una lista de palabras).  

Si todo está bien, ahora las palabras se guardarán en `localStorage` y el formulario desaparecerá tras enviarlo.  

### 5. Añadir el componente `<List />`  
Este componente también espera algunos `props`. Ten en cuenta lo siguiente:  
- `items`: Debe ser un array, aunque sea vacío por ahora.  
- `onItemClick`: Espera un callback que servirá para eliminar cada objeto de la lista. Esta función ya está a medio crear y se llama `handleDeleteWord`.  

### 6. Crear un estado para almacenar la lista de palabras y setearlo al montar el componente  
Aunque las palabras se están guardando en el `localStorage`, la lista no muestra nada. Es necesario almacenar la información en un estado y setearlo cuando se monte el componente para asegurarnos de que se renderiza.  
- Crea un nuevo estado llamado `"words"` y su `"setWords"` respectivo usando `useState()`.  
- Usa `useEffect` para ejecutar código al montar el componente. Busca un ejemplo de cómo usar [`useEffect` al montar un componente](https://www.reactjs.wiki/como-podemos-ejecutar-codigo-cuando-el-componente-se-monta) y agrégale la siguiente función:  
  ```js
  const retrievedWords = data.words.getAll();
  setWords(retrievedWords);
  ```
- Sustituye el array vacío que pasabas como `prop` a `<List />` por el estado `"words"`.  

### 7. Crear un `timeStamp` para asegurarnos de que la lista de palabras se actualiza cuando sea necesario  
Si todo ha ido bien, ahora la lista de palabras debería mostrarse correctamente al montar el componente por primera vez. Pero, ¿qué pasa cuando añadimos o eliminamos palabras?

Actualmente, React no sabe que el localStorage ha cambiado, por lo que no actualiza la interfaz. Para solucionar esto, crearemos un estado timeStamp que actualizará la lista cada vez que cambie su valor.

- Crear un estado timeStamp: Primero, define un nuevo estado en `App.jsx`
- Modificar el useEffect para que dependa de timeStamp: Ahora, en el useEffect que carga las palabras, pasaremos timeStamp como dependencia(añadirlo al array)
- Actualizar timeStamp cuando agreguemos o eliminemos palabras: Cada vez que agreguemos o eliminemos una palabra, simplemente llamamos a `setTimeStamp(Date.now())` para forzar la actualización:

### 8. Pulir detalles...  
- A la función `handleDeleteWord` le falta algo para actualizar la lista de palabras... ¿Qué será?  
- Cuando la lista está vacía... ¿Existe alguna forma de hacer que `<List/>` muestre al menos un mensaje avisando de ello?  

### 9. ¡Enhorabuena!  
Has conseguido implementar TODA la funcionalidad de palabras. 🎉  

Repasa lo que has hecho y verás que React es mucho menos complicado de lo que pensabas.  

### 10. Vuelta a empezar  
Ahora intenta replicarlo todo con números. Los métodos de `data.words` también existen para `data.numbers`. Intenta hacerlo con calma y sin presión. No es necesario completarlo todo hoy.  
