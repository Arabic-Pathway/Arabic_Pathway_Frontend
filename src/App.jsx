import './App.css'
import { Route, Routes } from 'react-router-dom';
import { Home, PostBlog } from './pages';

// TODOS:
// roadmaps
// course - structured content - arabic
// vocabulary - flash card site page & android app
// link to blogs website


function App() {

  return (
    <>
      <Routes>
        <Route index path='/' element={<Home/>} />
        <Route path='post' element={<PostBlog/>} />
      </Routes>
    </>
  )
}

export default App
