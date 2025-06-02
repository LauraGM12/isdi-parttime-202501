const Confirm = ({ message, onRejectConfirm, onConfirmAccept }) => {

    return <div className="z-30 absolute min-h-48 h-fit top-5 left-1/4 md:left-1/3 flex items-start flex-col justify-start w-1/2 md:w-1/3 p-4 text-gray-500 bg-white rounded-lg shadow-sm shadow-amber-600">
        <div className="w-full !px-2 flex items-center justify-end shrink-0 h-12 text-organge-500 bg-orange-100 rounded-t-lg">
            <button onClick={onRejectConfirm} type="button" className="cursor-pointer text-gray-400 hover:text-gray-900 rounded-lg">
                <i className="bi bi-x-lg"></i>
            </button>
        </div>
        <div className="w-full !pt-5 min-h-24 h-fit flex flex-col justify-center items-center text-center gap-5">
            <p className="text-lg w-full !px-2">{message}</p>
            <div className="flex flex-row gap-5">
                <button onClick={onRejectConfirm} className="!bg-red-500 hover:!bg-red-700 !text-white !font-bold !py-1 !px-4 !rounded cursor-pointer">Oh no</button>
                <button onClick={onConfirmAccept} className="!bg-green-500 hover:!bg-green-700 !text-white !font-bold !py-1 !px-4 !rounded cursor-pointer">Ok</button>
            </div>
        </div>

    </div>



}

export default Confirm