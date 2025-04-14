import { Route, Routes } from "react-router"
import Home from "./Private/Home"
import MyProfile from "./Private/MyProfile"
import UserProfile from "./Private/UserProfile"
import NotFound from "./NotFound"
import MyPosts from "./Private/MyPosts"
import Settings from "./Private/Settings"
import Posts from "./Private/Posts"

const Private = ({ setRefreshHeader }) => {
    return <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/my-profile" element={<MyProfile updateHeader={setRefreshHeader} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/*" element={<NotFound />} />
    </Routes>
}

export default Private