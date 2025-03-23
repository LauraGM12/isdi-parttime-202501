/*Este componente cumple un proposito muy parecido a la función createForm que tenemos hecha en nuestra app de js vanilla*/
/*Inputs se espera que sea un array de objetos tipo { type: 'number', placeholder: 'Nuevo número', id: 'number', className: 'input' }*/

const Form = ({ inputs, onSubmitCallback, submitText, className }) => {
    const onSubmitForm = (event) => {
        event.preventDefault()
        const form = event.target
        const formData = {}
        inputs.forEach(input => {
            const inputName = input.id;
            const inputValue = form[input.id].value
            formData[inputName] = inputValue
        })

        onSubmitCallback(formData)
    }

    return <form className={className} onSubmit={onSubmitForm}>
        {inputs.map((input, index) => {
            return <input className={input.className} key={index} id={input.id} type={input.type} placeholder={input.placeholder} />
        })}
        <input type="submit" value={submitText} />
    </form>
}