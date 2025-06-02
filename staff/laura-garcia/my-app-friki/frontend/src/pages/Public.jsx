import { Routes, Route } from "react-router"
import NotFound from "./NotFound"
import Landing from "./Public/Landing"
import Login from "./Public/Login"
import Register from "./Public/Register"



const Public = ({ setRefreshHeader, locale }) => {

    return <div>
        <Routes>
            <Route path="/" element={<Landing locale={locale} />} />
            <Route path="/login" element={<Login setRefreshHeader={setRefreshHeader} locale={locale} />} />
            <Route path="/register" element={<Register setRefreshHeader={setRefreshHeader} locale={locale} />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    </div>
}

export default Public