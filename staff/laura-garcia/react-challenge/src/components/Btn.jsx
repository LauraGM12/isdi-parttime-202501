/*Este componente cumple un proposito muy parecido al de la función de createButton que tenemos hecha en nuestra app de js vanilla*/

const Btn = ({ btnContent, btnCallback, className }) => {
    return <button className={className} onClick={btnCallback}>{btnContent}</button>
}