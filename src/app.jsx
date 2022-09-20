import { useState, useEffect } from 'preact/hooks'
import axios from 'axios'
import MainLayout from './layout/MainLayout'
import './style/index.css'

export function App() {
  const [images, setImages] = useState([])
  const [search, setSearch] = useState(null)
  const [nextPage, setNextPage] = useState(2)
  const [isLoading, setIsLoading] = useState(false)

  const fetchImages = async (page = 1) => {
    page === 1 ? setIsLoading(true) : setIsLoading(false)
    const uri = search ? `search?query=${search}&` : `curated?`

    const url = `${import.meta.env.VITE_BASE_URL}${uri}page=${page}&per_page=16`

    await axios
      .get(url, {
        headers: {
          Authorization: import.meta.env.VITE_API_KEY,
        },
      })
      .then(({ data }) => {
        page == 1
          ? setImages(data.photos)
          : setImages([...images, ...data.photos])
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchMoreImages = async () => {
    await fetchImages(nextPage)
    setNextPage(nextPage + 1)
  }

  useEffect(() => {
    fetchImages()
  }, [search])

  const chunkArray = (arr, size) => {
    const groupedArray = []
    for (let i = 0; i < arr?.length; i += size) {
      groupedArray.push(arr.slice(i, i + size))
    }
    return groupedArray
  }

  return (
    <>
      <MainLayout>
        <h1>
          The best free stock photos, royalty free images &#38; videos shared by
          creators.
        </h1>
        <p>
          <a target='_blank' href='https://www.pexels.com'>
            <small>Photos provided by Pexels</small>
          </a>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            fetchImages(1)
          }}
        >
          <input
            type='text'
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {isLoading ? (
          <article aria-busy='true'></article>
        ) : (
          chunkArray(images, 4).map((chunk) => (
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
          ))
        )}
        {isLoading
          ? null
          : images.length > 0 && (
              <button onClick={fetchMoreImages}>Load More</button>
            )}
      </MainLayout>
    </>
  )
}
