import React, { useState } from 'react';
import { BrowserRouter, Routes, Route,Navigate,useLocation } from 'react-router-dom';
import Home from "./pages/home"
import Register from './pages/authentication/register';
import WaitingRegister from './pages/authentication/wait-verify';
import Login from './pages/authentication/login';
import HomeLayout from './components/ui/HomeLayout';
import Verify from './pages/authentication/verify';
import Diary from './components/diary/Diary';
import { MeHook } from './store/me/hooks';
import MyBlog from './pages/blog/[name]';
import CreateTextBlog from './pages/new/text';
import EditTextBlog from './pages/edit/[username]';
import Setting from './pages/blog/[name]/settings';
import Record from './pages/blog/[name]/record';
import BlogList from './components/blog/BlogList';
import Profile from './components/blog/Profile';
import ProfileModal from './components/blog/ProfileModal';
import BlogDetail from './components/blog/BlogDetail';
import Explore from './pages/explore';
import AdminLayout from './components/ui/AdminLayout';
import AdminUsers from './pages/admin/users';
import AdminBlogs from './pages/admin/censorship';

function App() {

  const location = useLocation();
  //@ts-ignore
  const background = location.state && location.state.background;

  console.log("BACK GROUND", background);
  const me = MeHook.useMe();
  return (
    <div>
      <Routes location={background || location}>
       <Route path="/" element={<HomeLayout children={<Home/>}/>} />
       <Route path="/authentication/register" element={<HomeLayout children={<Register/>}/>} />
       <Route path="/authentication/wait-verify" element={<HomeLayout children={<WaitingRegister/>}/>} />
       <Route path="/authentication/verify/" element={<HomeLayout children={<Verify/>}/>} />
       <Route path="/authentication/login" element={<HomeLayout children={<Login/>}/>} />
       {/* <Route path="/diary" element={<HomeLayout children={me? <Diary/>: <Navigate to="/authentication/login" />}/>} /> */}
       <Route path="/blog/:username"element={<HomeLayout children={<MyBlog/>}/>} />

       <Route path="/edit/:username/:id"element={<HomeLayout children={<EditTextBlog/>}/>} />

       <Route path="/new/text"element={<HomeLayout children={<CreateTextBlog/>}/>} />
       <Route path="/settings/blog/:username"element={<HomeLayout children={<Setting/>}/>} />

       <Route path="/admin/users"element={<AdminLayout children={<AdminUsers/>}/>} />
       <Route path="/admin/blogs"element={<AdminLayout children={<AdminBlogs/>}/>} />

       <Route path="/active/blog/:username"element={<HomeLayout children={<Record/>}/>} />

       <Route path="/search/:q" element={<HomeLayout children={<BlogList/>}/>} />
       {/* <Route path="/blog/view/:username/:id"element={<HomeLayout children={<BlogList/>}/>} /> */}
       {/* {background && <Route path="/blog/view/:username"element={<ProfileModal/>} />} */}
       <Route path="/blog/view/:username"element={<Profile/>} />
       <Route path="/blog/view/:username/:id"element={<BlogDetail/>} />
       
       <Route path="/explore/trending" element={<HomeLayout children={<Explore/>}/>} />
       <Route path="/explore/staff-picks" element={<HomeLayout children={<Explore/>}/>} />
      </Routes>
        {background && 
          <Routes>
          <Route path="/blog/view/:username"element={<ProfileModal/>} />
          <Route path="/blog/view/:username/:id"element={<BlogDetail/>} />
        </Routes>
        }
    </div>
  );
}

export default App;
