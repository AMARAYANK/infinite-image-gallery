import React, { useState, useEffect} from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroll-component';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY

export default function App() {
  const [images, setImages] = useState([])
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getPhotos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  
  function getPhotos(){
    let apiURL = `https://api.unsplash.com/photos?`
    if(query) apiURL = `https://api.unsplash.com/search/photos?query=${query}`

    apiURL+= `&page=${page}`
    apiURL+= `&client_id=${accessKey}`

    fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      const imagesFromApi = data.results ?? data 
      if(page === 1) setImages(imagesFromApi)
      setImages((images) => [...images, ...imagesFromApi])
    })
  }


 // return an error if there is no access key
 if(!accessKey){
   return <a href='https://unsplash.com/developers' className='error'>
    Required: Get your unsplash API key first!
    </a>
 }
 
 function searchPhotos(e){
   e?.preventDefault() 
   setPage(1)
   getPhotos()
 }
 
 function searchText(e){
   setQuery(e.target.value)
 }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchPhotos}>
        <input value={query} type="text" placeholder="Search Unsplash..." onChange={searchText}/>
        {query ? <button>Search</button> : <button disabled>Search</button> }
      </form>

      <InfiniteScroll
      dataLength={images.length}
      next={() => setPage((page) => page + 1)}
      hasMore={true}
      loader={<h4>Loading...</h4>}
      >
      <div className="image-grid">
        {images.map((image, index) => (
          <a className="image" key={index} href={image.links.html} target="_blank" rel="noopener noreferrer">
            <img src={image.urls.regular} alt={image.alt_description} />
          </a>
        ))}
      </div>
      </InfiniteScroll>

    </div>
  );
}
