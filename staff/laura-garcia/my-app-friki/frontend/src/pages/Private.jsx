import { Route, Routes } from "react-router"
import Home from "./Private/Home"
import NotFound from "./NotFound"
import MyProfile from "./Private/MyProfile"
import UserProfile from "./Private/UserProfile"
import MyPosts from "./Private/MyPosts"
import Settings from "./Private/Settings"
import Posts from "./Private/Posts"

const Private = ({ setRefreshHeader, locale }) => {
    return (
        <Routes>
            <Route path="/" element={<Home locale={locale} />} />
            <Route path="/home" element={<Home locale={locale} />} />
            <Route path="/my-posts" element={<MyPosts locale={locale} />} />
            <Route path="/my-profile" element={<MyProfile updateHeader={setRefreshHeader} locale={locale} />} />
            <Route path="/settings" element={<Settings locale={locale} />} />
            <Route path="/*" element={<NotFound locale={locale} />} />
        </Routes>
    )
}

export default Private