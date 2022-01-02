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

import AdminChallenge from './pages/admin/challenge';
import CreateChallenge from './pages/admin/challenge/create';
import ChallengeDetail from './pages/challenge/detail';
import EditChallenge from './pages/admin/challenge/edit';
import Result from './pages/podcasts/listen/name/result';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
       <Route path="/" element={<HomePageLayout children={<Home/>}/>} />
       <Route path="/admin/podcasts" element={<LayoutAdmin children={<AdminPodcast/>} />} />
       <Route path="/admin/podcasts/create" element={<LayoutAdmin children={<CreatePodcast/>} />} />
       <Route path="/admin/podcasts/edit/:id" element={<LayoutAdmin children={<EditPodcast/>} />} />
       <Route path="/podcasts/detail/:name/:id" element={<HomePageLayout children={<PodcastDetail/>}/>} />
       <Route path="/podcasts/listen/:name/:id" element={<HomePageLayout children={<PodcastListen/>}/>} />
       <Route path="/podcasts/listen/:name/:id/result" element={<HomePageLayout children={<Result/>}/>} />

       <Route path="/admin/challenge" element={<LayoutAdmin children={<AdminChallenge/>} />} />
       <Route path="/admin/challenge/create" element={<LayoutAdmin children={<CreateChallenge/>} />} />
       <Route path="/challenge/detail/:id" element={<HomePageLayout children={<ChallengeDetail/>}/>} />
       <Route path="/admin/challenge/edit/:id" element={<LayoutAdmin children={<EditChallenge/>} />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
