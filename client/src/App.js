import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'
import { Document, Page, pdfjs} from 'react-pdf'
import './App.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const api_endpoint = 'http://localhost:8000/';

const SearchButton = (props) => {
  const { isExtraction } = props
  return (
      <button
          type="submit"
          className="text-white bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 ml-3"
      >
          <span className="hidden md:block">{isExtraction ? 'Extract' : 'Search'}</span>
      </button>
  )
}

const SearchInput = (props) => {
  const { value, isExtraction, onSearchChange, onClear } = props
  return (
      <div className="flex rounded-full sm:rounded-md shadow-inner sm:shadow-sm w-full md:max-w-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder={isExtraction? `Define a JSON dict of entities and descriptions. ex: {"name": "the name of the company"}` : `Ask a question about your document...`}
                  className="focus:ring-0 block w-full rounded-none rounded-l-md border-0 py-1.5 sm:ring-1 sm:ring-inset sm:ring-gray-300 sm:dark:ring-neutral-500 sm:focus:ring-2 sm:focus:ring-inset sm:focus:ring-blue-600 sm:dark:focus:ring-blue-600 sm:text-sm sm:leading-6 bg-transparent dark:placeholder-neutral-400"
                  value={value}
                  onChange={onSearchChange}
              />
          </div>
          <button
              type="button"
              className="focus:ring-0 focus:text-blue-600 hover:text-blue-600 dark:text-white/50 dark:hover:text-blue-600 relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md p-2 text-xs sm:text-sm font-semibold sm:ring-1 ring-inset ring-gray-300 dark:ring-neutral-500 sm:focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-600 focus:outline-none sm:hover:bg-gray-50 sm:hover:dark:bg-dark-900"
              onClick={onClear}
          >
            <FaTimes />
          </button>
      </div>
  )
}

const LoadingSpinner = (props) => {
  const { isLoading } = props
  return isLoading ? (
      <div role="status" className="my-4 flex justify-center items-center">
          <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
              <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
              />
              <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
              />
          </svg>
          <span class="sr-only">Loading...</span>
      </div>
  ) : (
      <></>
  )
}

const PDFViewer = (props) => {
  const { url, pageNumber } = props;
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${api_endpoint}pdf?url=${url}`);
      const data = await response.blob();
      setPdfData(data);
    }
    fetchData();
  }, [url]);

  return (
    <div>
      <Document file={pdfData}>
        <Page pageNumber={pageNumber} renderAnnotationLayer={false}/>
      </Document>
    </div>
  );
}

const TextViewer = (props) => {
  const { text, srcPage, pageId, charStart, charEnd } = props;
  if (charStart === -1 || pageId !== srcPage) {
    return <div>{text}</div>
  }
  const before = text.slice(0, charStart);
  const highlighted = text.slice(charStart, charEnd + 1);
  const after = text.slice(charEnd + 1);
  return (
    <div>
      {before}
      <span className="bg-yellow-200 bg-opacity-50">{highlighted}</span>
      {after}
    </div>
  );
}

const ModeButton = (props) => {
  const { title, onClick } = props;
  return (
  <button
    type="button"
    className="inline-flex items-center gap-x-1.5 rounded-md bg-[#ebf0f4] dark:bg-dark-800 py-1.5 px-2.5 text-sm font-semibold text-[#24292f] dark:text-neutral-200 shadow-sm focus-visible:outline focus-visible:outline-2 hover:bg-gray-400 focus-visible:outline-offset-2 "
    onClick={onClick}
  >
    {/* {icon} */}
    {title && <span className="hidden md:block">{title}</span>}
  </button>
)
}


function App() {
  const [result, setResult] = useState('');
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  // setting other properties
  const [pageId, setPageId] = useState(1);
  const [charOffset, setCharOffset] = useState([-1, -1]);
  const [isLoading, setIsLoading] = useState(false);
  const [extractionMode, setExtractionMode] = useState(false);

  const handleSearchChange = (event) => {
    const { value } = event.target
    setQuery(value)
  }

  const handleClearSearch = () => {
      setQuery('')
      setResult('')
      setItems([])
      // clearing other properties
      setPageId(1)
      setCharOffset([-1, -1])
  }
  
  const handleSearchButtonClick = (event) => {
    if (query === '') {
      return
    }
    setIsLoading(true);
    if (!extractionMode) {
      fetch(`${api_endpoint}search?query=${query}`)
        .then(response => response.json())
        .then(result => {
          setResult(result.message)
          setItems(result.items)
          //set other properties
          setPageId(result.page_id)
          setCharOffset(result.char_offset)
          setIsLoading(false);
        })
        .catch(error => console.error(error));
    } else {
      fetch(`${api_endpoint}extract?query=${query}`)
        .then(response => response.json())
        .then(result => {
          setResult(result.message)
          setItems(result.items)
          //set other properties
          setPageId(result.page_id)
          setCharOffset(result.char_offset)
          setIsLoading(false);
        })
        .catch(error => console.error(error));
    }
  }

  const handleSetRetrievalMode = (event) => {
    setExtractionMode(false);
    setQuery('')
  }

  const handleSetExtractionMode = (event) => {
    setExtractionMode(true);
    setQuery('')
    setResult('')
    setItems([])
    // clearing other properties
    setPageId(1)
    setCharOffset([-1, -1])
  }


  return (
    <main className='h-screen bg-white dark:bg-dark-900 dark:text-white overflow-y-auto max-h-screen'>
      <div className="App">
        <div className="fixed sm:relative w-full sm:flex flex-col p-2 sm:p-6 space-y-1.5">
          <h1 className="text-4xl font-bold text-white" style={{ cursor: 'pointer' }}>
              PDF GPT
          </h1>
            <div className="inline-flex gap-x-1.5 align-middle justify-center">
                <ModeButton title="Retrieval Mode" onClick={handleSetRetrievalMode} />
                <ModeButton title="Extraction Mode" onClick={handleSetExtractionMode} />
            </div>
            <div className='hidden sm:block sm:px-6 sm:pb-2'>
                <form
                    autoComplete={'off'}
                    className="flex justify-center"
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleSearchButtonClick(event)
                    }}
                >
                    <SearchInput
                        value={query}
                        isExtraction={extractionMode}
                        onSearchChange={handleSearchChange}
                        onClear={handleClearSearch}
                    />
                    <SearchButton
                      isExtraction={extractionMode}
                    />
                </form>
          </div>
        </div>
        <div className="flex flex-col text-white sm:p-2">
          <div className="hidden sm:flex sm:flex-col h-full w-full max-h-[23rem] lg:max-h-full overflow-y-auto items-center">
            <LoadingSpinner isLoading={isLoading} />
            {result && !isLoading ? (
                  <p className='flex justify-center w-full'>{result}</p>
              ) : (
                <></>
              )}
          </div>
        </div>
        <div className="flex flex-col text-white sm:p-6">
          {result && !isLoading ? (
          <div>
            <div className="flex flex-col text-white text-md">
              <h2 style={{ fontWeight: "bold" }}>Retrieved results</h2>
            </div>
            <div className="flex flex-col text-white sm:px-6 sm:pb-2">
              {items.map((item) => (
              <div className="flex flex-col text-white sm:px-6 sm:pb-2">
                <div className="grid grid-cols-1 p-2 pt-4 border-t border-coolGray-200">
                  <div className="flex items-center col-span-2">
                    <span className="text-md">{item.metadata["source"].split("/").pop()} Page: {item.metadata["page"]}</span>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <div className="flex col-span-2 px-2 mr-8 min-h-28">
                  <div className="flex items-center my-2 text-sm">
                    <PDFViewer
                      url={item.metadata["source"]}
                      pageNumber={item.metadata["page"]}
                    />
                  </div>
                </div>
                </div>
              </div>
              ))}
              </div>
          </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
