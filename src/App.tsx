import { Routes, Route } from 'react-router-dom'
import BaseLayout from './layouts/BaseLayout'
import Home from './pages/Home'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'
import Categories from './pages/Categories'
import CategoryDetail from './pages/CategoryDetail'
import Tags from './pages/Tags'
import TagDetail from './pages/TagDetail'
import SeriesList from './pages/SeriesList'
import SeriesDetail from './pages/SeriesDetail'
import Timeline from './pages/Timeline'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:category" element={<CategoryDetail />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/tags/:tag" element={<TagDetail />} />
        <Route path="/series" element={<SeriesList />} />
        <Route path="/series/:series" element={<SeriesDetail />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
