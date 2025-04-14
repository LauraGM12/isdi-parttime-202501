import { Routes, Route } from "react-router"
import NotFound from "./NotFound"
import Landing from "./Public/Landing"
import Login from "./Public/Login"
import Register from "./Public/Register"



const Public = ({ setRefreshHeader }) => {

    return <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setRefreshHeader={setRefreshHeader} />} />
        <Route path="/register" element={<Register setRefreshHeader={setRefreshHeader} />} />
        <Route path="/*" element={<NotFound />} />
    </Routes>
}

export default Public