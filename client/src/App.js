import React, { useState } from 'react'
// Components
import SearchInput from './inputs'
import { SearchButton, ModeButton} from './buttons'
import ExtractionView from './extraction'
import RetrievalView from './retrieval'
import './App.css';


const api_endpoint = 'http://localhost:8000/';

const Mode = {
  RETRIEVAL: 'retrieval',
  EXTRACTION: 'extraction',
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

  const handleDownloadButtonClick = (event) => {
    fetch(`${api_endpoint}download_csv?entity_json=${query}&results_json=${JSON.stringify(items)}`)
      .then(response => {
        response.blob().then(blob => downloadCsv(blob))
      })
      .catch(error => console.error(error));
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
        .then(response => response.json())
        .then(result => {
          setItems(result)
          setIsLoading(false)
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
              PDF GPT
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
        {mode == Mode.RETRIEVAL ? (
          <RetrievalView 
            answer={answer}
            items={items}
            itemIndex={itemIndex}
            setItemIndex={setItemIndex}
            isLoading={isLoading}
          />
        ) : (
          <ExtractionView
            items={items}
            itemIndex={itemIndex}
            setItemIndex={setItemIndex}
            isLoading={isLoading}
            handleDownloadButtonClick={handleDownloadButtonClick}
          />
        )}
      </div>
    </main>
  );
}

export default App;
