import React, { useState } from 'react'
// Components
import SearchInput from './inputs'
import LoadingSpinner from './spinner'
import { PDFViewer } from './viewer'
import { SearchButton, ModeButton, PrevButton, NextButton} from './buttons'
import './App.css';


const api_endpoint = 'http://localhost:8000/';

const Mode = {
  RETRIEVAL: 'retrieval',
  EXTRACTION: 'extraction',
}

const PageItem = (props) => {
  const { items, itemIndex} = props;
  const pageItem = items[itemIndex];
  // TODO: need a different div here for extraction mode.
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
  const [answer, setAnswer] = useState('');
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [itemIndex, setItemIndex] = useState(0);

  // Other properties
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(Mode.RETRIEVAL);

  const handleSearchChange = (event) => {
    const { value } = event.target
    setQuery(value)
  }

  const handleClearSearch = () => {
      setQuery('')
      setAnswer('')
      setItems([])
  }

  const downloadCsv = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `pdf_genie_${(new Date().toJSON().slice(0,10))}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  const handleSearchButtonClick = (event) => {
    if (query === '') {
      return
    }
    setIsLoading(true);
    if (mode === Mode.RETRIEVAL) {
      fetch(`${api_endpoint}search?query=${query}`)
        .then(response => response.json())
        .then(result => {
          setAnswer(result.answer)
          setItems(result.items)
          setIsLoading(false);
        })
        .catch(error => console.error(error));
    } else if (mode === Mode.EXTRACTION) {
      fetch(`${api_endpoint}extract?entity_json=${query}`)
        .then(response => {
          setIsLoading(false);
          response.blob().then(blob => downloadCsv(blob))
        })
        .catch(error => console.error(error));
    }
  }

  const handleSetRetrievalMode = (event) => {
    setMode(Mode.RETRIEVAL);
    setQuery('')
  }

  const handleSetExtractionMode = (event) => {
    setMode(Mode.EXTRACTION);
    setQuery('')
    setAnswer('')
    setItems([])
  }


  return (
    <main className='h-screen bg-white dark:bg-dark-900 dark:text-white overflow-y-auto max-h-screen'>
      <div className="App">
        <div className="fixed sm:relative w-full sm:flex flex-col p-2 sm:p-6 space-y-1.5">
          <h1 className="text-4xl font-bold text-white" style={{ cursor: 'pointer' }}>
              PDF Genie
          </h1>
            <div className="inline-flex gap-x-1.5 align-middle justify-center">
                <ModeButton title="Retrieval Mode" onClick={handleSetRetrievalMode} pressed={mode === Mode.RETRIEVAL}/>
                <ModeButton title="Extraction Mode" onClick={handleSetExtractionMode} pressed={mode === Mode.EXTRACTION}/>
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
                        isExtraction={mode === Mode.EXTRACTION}
                        onSearchChange={handleSearchChange}
                        onClear={handleClearSearch}
                    />
                    <SearchButton
                      isExtraction={mode === Mode.EXTRACTION}
                    />
                </form>
          </div>
        </div>
        <div className="flex flex-col text-white sm:p-2">
          <div className="hidden sm:flex sm:flex-col h-full w-full max-h-[23rem] lg:max-h-full overflow-y-auto items-center">
            <LoadingSpinner isLoading={isLoading} />
            {answer && !isLoading ? (
                  <p className='flex justify-center w-full'>{answer}</p>
              ) : (
                <></>
              )}
          </div>
        </div>
        <div className="flex flex-col text-white sm:p-6">
          {answer && !isLoading ? (
          <div>
            <div className="flex flex-col text-white text-md">
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
