const Btn = ({ btnContent, btnClassnames, btnCallback }) => {

    return <button onClick={btnCallback} className={btnClassnames}>{btnContent}</button>
}

export default Btn