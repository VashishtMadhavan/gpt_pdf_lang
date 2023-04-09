import React, { useState } from 'react';
import './App.css';
import {SearchButton, ModeButton, PrevButton, NextButton} from './components/buttons'
import SearchInput from './components/inputs'
import LoadingSpinner from './components/spinner'
import { PDFViewer } from './components/viewer'

const api_endpoint = 'http://localhost:8000/';

const PageItem = (props) => {
  const { items, itemIndex} = props;
  const pageItem = items[itemIndex];
  return (
    <div className="flex flex-col text-white sm:px-6 sm:pb-2">
      <div className="grid grid-cols-1 p-2 pt-4 border-t border-coolGray-200">
        <div className="flex items-center justify-center col-span-2">
          <span className="text-md"> File: {pageItem.metadata["source"].split("/").pop()} Page: {pageItem.metadata["page"]}</span>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2'>
          <PDFViewer
            url={pageItem.metadata["source"]}
            pageNumber={pageItem.metadata["page"]}
          />
      </div>
    </div>
  )
}

function App() {
  const [result, setResult] = useState('');
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [itemIndex, setItemIndex] = useState(0);

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
            <div className="flex flex-col text-white border-hidden">
              <h2 className="text-2xl font-bold">References</h2>
            </div>
            <div className="flex flex-col text-white justify-center border-hidden">
              <PageItem items={items} itemIndex={itemIndex} />
              <div className="flex flex-row justify-center">
                <PrevButton itemIndex={itemIndex} setItemIndex={setItemIndex} />
                <span className="flex items-center justify-center">{itemIndex + 1} of {items.length}</span>
                <NextButton itemIndex={itemIndex} setItemIndex={setItemIndex} maxItemIndex={items.length - 1} />
              </div>
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
