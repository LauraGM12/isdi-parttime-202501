const Btn = ({ btnContent, btnClassnames, btnCallback }) => {

    return <button type="button" onClick={btnCallback} className={btnClassnames}>{btnContent}</button>
}

export default Btn