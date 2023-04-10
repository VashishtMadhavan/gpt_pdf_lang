import { FaTimes } from 'react-icons/fa'
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

export default SearchInput