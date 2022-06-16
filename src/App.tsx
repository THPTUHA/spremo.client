import React, { useState } from 'react';
import { BrowserRouter, Routes, Route,Navigate,useLocation } from 'react-router-dom';
import Home from "./pages/home"
import Register from './pages/authentication/register';
import WaitingRegister from './pages/authentication/wait-verify';
import Login from './pages/authentication/login';
import HomeLayout from './components/ui/HomeLayout';
import Verify from './pages/authentication/verify';
import { MeHook } from './store/me/hooks';
import MyBlog from './pages/blog/[name]';
import CreateTextBlog from './pages/new/text';
import EditTextBlog from './pages/edit/[username]';
import Record from './pages/blog/[name]/record/record';
import SearchBlog from './pages/search';
import ProfileModal from './components/blog/ProfileModal';
import Trending from './pages/explore/trending';
import BlogBannedDetail from './pages/blog/[name]/banned/detail';
import BlogViewDetail from './pages/blog/[name]/detail';
import CreateMusic from './pages/new/music';
import NewBlog from './pages/new';
import CreateNote from './pages/new/note';
import CreateVoiceRecord from './pages/new/voice.record';
import Setting from './pages/settings';
import StaffPick from './pages/explore/staff.pick';
import Recommended from './pages/explore/recommended.for.you';
import BookMark from './pages/blog/[name]/bookmarks';
import AdminBlogs from './pages/admin/censorship';
import AdminBlogsBanned from './pages/admin/blog/banned';
import AdminBlogsStaffPick from './pages/admin/blog/picked';
import AdminLayout from './components/ui/AdminLayout';
import AdminUsers from './pages/admin/users';

function App() {

  const location = useLocation();
  //@ts-ignore
  const background = location.state && location.state.background;
  console.log("Background",background);
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
       {/* <Route path="/:option/blog/:username/" element={<HomeLayout children={</>}/>} /> */}

       <Route path="/edit/:username/:id"element={<HomeLayout children={<EditTextBlog/>}/>} />
        
       <Route path="/new" element={<NewBlog/>} />
       <Route path="/new/text"element={<HomeLayout children={<CreateTextBlog/>}/>} />
       <Route path="/new/music"element={<CreateMusic/>} />
       <Route path="/new/note"element={<CreateNote/>} />
       <Route path="/new/voice.record"element={<CreateVoiceRecord/>} />
       
       <Route path="/blog/:username"element={<HomeLayout children={<MyBlog/>}/>} />
       <Route path="/blog/:username/bookmarks"element={<HomeLayout children={<BookMark/>}/>} />
       <Route path="/blog/:username/active"element={<HomeLayout children={<Record/>}/>} />

       <Route path="/admin/users/all"element={<AdminLayout children={<AdminUsers/>}/>} />
       <Route path="/admin/blogs/all"element={<AdminLayout children={<AdminBlogs/>}/>} />
       <Route path="/admin/blogs/banned"element={<AdminLayout children={<AdminBlogsBanned/>}/>} />
       <Route path="/admin/blogs/picked"element={<AdminLayout children={<AdminBlogsStaffPick/>}/>}/>

       <Route path="/active/blog/:username"element={<HomeLayout children={<Record/>}/>} />

       <Route path="/search/:q" element={<HomeLayout children={<SearchBlog/>}/>} />
     
       <Route path="/blog/view/:username"element={<ProfileModal/>} />
       <Route path="/blog/view/:username/:id"element={<BlogViewDetail/>} />
       <Route path="/blog/banned/:username/:id"element={<BlogBannedDetail/>} />
        
       <Route path="/explore/trending" element={<HomeLayout children={<Trending/>}/>} />
       <Route path="/explore/staff-picks" element={<HomeLayout children={<StaffPick/>}/>} />
       <Route path="/explore/recommended-for-you" element={<HomeLayout children={<Recommended/>}/>} />

       <Route path="/settings/:type" element={<HomeLayout children={<Setting/>}/>} />
       
      </Routes>
        {background && 
        <Routes>
          <Route path="/blog/view/:username"element={<ProfileModal/>} />
          <Route path="/blog/view/:username/:id"element={<BlogViewDetail/>} />
          <Route path="/new/music"element={<CreateMusic/>} />
          <Route path="/new"element={<NewBlog/>} />
          <Route path="/new/note"element={<CreateNote/>} />
          <Route path="/new/voice.record"element={<CreateVoiceRecord/>} />
        </Routes>
        }
    </div>
  );
}

export default App;
