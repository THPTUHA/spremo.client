import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/home"
import HomePageLayout from './components/ui/HomePageLayout';
import LayoutAdmin from './components/ui/LayoutAdmin';
import AdminPodcast from './pages/admin/podcasts';
import CreatePodcast from './pages/admin/podcasts/create';
import EditPodcast from './pages/admin/podcasts/edit';
import PodcastDetail from './pages/podcasts/detail/name';
import PodcastListen from './pages/podcasts/listen/name';

import AdminChallenge from './pages/admin/challenges';
import CreateChallenge from './pages/admin/challenges/create';
import ChallengeDetail from './pages/challenges/detail/name';
import EditChallenge from './pages/admin/challenges/edit';
import Result from './pages/podcasts/listen/name/result';
import Podcast from './pages/podcasts';
import Billboard from './pages/billboard';
import NewFeeds from './pages/news-feed';
import Challenge from './pages/challenges';
import Register from './pages/authentication/register';
import WaitingRegister from './pages/authentication/wait-verify';
import Login from './pages/authentication/login';
import Search from './pages/search';
import Notifications from './pages/notifications';
function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
       <Route path="/" element={<HomePageLayout children={<Home/>}/>} />
       <Route path="/authentication/register" element={<Register/>} />
       <Route path="/authentication/wait-verify" element={<WaitingRegister/>} />
       <Route path="/authentication/login" element={<Login/>} />

       <Route path="/admin/podcasts" element={<LayoutAdmin children={<AdminPodcast/>} />} />
       <Route path="/admin/podcasts/create" element={<LayoutAdmin children={<CreatePodcast/>} />} />
       <Route path="/admin/podcasts/edit/:id" element={<LayoutAdmin children={<EditPodcast/>} />} />

       <Route path="/podcasts" element={<HomePageLayout children={<Podcast/>}/>} />
       <Route path="/podcasts/detail/:name/:id" element={<HomePageLayout children={<PodcastDetail/>}/>} />
       <Route path="/podcasts/listen/:name/:id" element={<HomePageLayout children={<PodcastListen/>}/>} />
       <Route path="/podcasts/listen/:name/:id/result" element={<HomePageLayout children={<Result/>}/>} />

       <Route path="/challenges" element={<HomePageLayout children={<Challenge/>}/>} />
       <Route path="/admin/challenges" element={<LayoutAdmin children={<AdminChallenge/>} />} />
       <Route path="/admin/challenges/create" element={<LayoutAdmin children={<CreateChallenge/>} />} />
       <Route path="/challenges/detail/:name/:id" element={<HomePageLayout children={<ChallengeDetail/>}/>} />
       <Route path="/admin/challenges/edit/:id" element={<LayoutAdmin children={<EditChallenge/>} />} />

       <Route path="/billboard" element={<HomePageLayout children={<Billboard/>}/>} />
       <Route path="/news-feed" element={<HomePageLayout children={<NewFeeds/>}/>} />
       <Route path="/notifications" element={<HomePageLayout children={<Notifications/>}/>} />
       <Route path="/search" element={<HomePageLayout children={<Search/>}/>} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
