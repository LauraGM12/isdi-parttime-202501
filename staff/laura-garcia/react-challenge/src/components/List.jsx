const List = ({ items, onItemClick }) => {
    return <ol>
        {/*PASO 8: maneja condicionales por aquí para mostrar un mensaje*/}
        {items.length === 0 ? (
            <p>No hay palabras guardadas todavía</p>
        ) : (
            items.map((item, index) => {
                return <li key={index}>
                    <div className="list-item">
                        {item}
                        {/*PASO 1: Fijate en los props que le pasamos a este botón*/}
                        <Btn
                            className={'delete'}
                            btnCallback={() => onItemClick(index)}
                            btnContent={'X'}
                        />
                    </div>
                </li>
            })
        )}
    </ol>
}