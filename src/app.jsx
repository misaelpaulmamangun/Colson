import { useState, useEffect } from 'preact/hooks';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainLayout from './layout/MainLayout';
import './style/index.css';

export function App() {
  const [images, setImages] = useState([]);

  const [page, setPage] = useState(0);

  const fetchImages = (page) => {
    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}curated/?page=${page}&per_page=16`,
        {
          headers: {
            Authorization: import.meta.env.VITE_API_KEY,
          },
        }
      )
      .then(({ data }) => {
        setImages([...images, ...data.photos]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchMoreImages = () => {
    setPage(page + 1);
    fetchImages(page + 2);
  };

  useEffect(() => {
    fetchImages(page);
  }, []);

  const chunkArray = (arr, size) => {
    var groupedArray = [];
    for (var i = 0; i < arr?.length; i += size) {
      groupedArray.push(arr.slice(i, i + size));
    }
    return groupedArray;
  };

  return (
    <>
      <MainLayout>
        <h1>
          The best free stock photos, royalty free images &#38; videos shared by
          creators.
        </h1>
        <form>
          <div>
            <input type='text' placeholder='Search' />
          </div>
        </form>

        <div className='grid'>
          <button className='outline'>Home</button>
          <button className='outline'>Videos</button>
          <button className='outline'>Leaderboard</button>
          <button className='outline'>Challenges</button>
        </div>

        <div>
          <a target='_blank' href='https://www.pexels.com'>
            <small>Photos provided by Pexels</small>
          </a>
        </div>

        {chunkArray(images, 4).map((chunk) => (
          <div className='grid'>
            {chunk.map((image) => (
              <article>
                <img src={image?.src.portrait} />
                <footer>
                  <center>
                    <div>Photographer</div>
                    <small>{image.photographer}</small>
                  </center>
                </footer>
              </article>
            ))}
          </div>
        ))}
        {images.length > 0 && (
          <button onClick={fetchMoreImages}>Load More</button>
        )}
      </MainLayout>
    </>
  );
}
