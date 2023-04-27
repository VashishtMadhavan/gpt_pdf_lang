import React from 'react';

function SearchButton(props) {
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

function ModeButton(props) {
    const { title, onClick, pressed } = props;
    const classStyle = "inline-flex items-center gap-x-1.5 rounded-md dark:bg-dark-800 py-1.5 px-2.5 text-sm font-semibold text-[#24292f] dark:text-neutral-200 hover:bg-gray-500 "

    return (
        <button
        type="button"
        className={pressed ? classStyle + "bg-gray-400" : classStyle + "bg-[#ebf0f4]"}
        onClick={onClick}
        >
        {title && <span className="hidden md:block">{title}</span>}
        </button>
    )
}

function DownloadButton(props) {
    const { onClick } = props;
    return (
        <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-md dark:bg-dark-800 py-1.5 px-2.5 text-sm font-semibold text-[#24292f] dark:text-neutral-200 hover:bg-gray-500 bg-[#ebf0f4]"
        onClick={onClick}
        >
         <span className="hidden md:block">Download CSV</span>
        </button>
    )
}

function PrevButton(props) {
    const { setItemIndex, itemIndex } = props;
    return (
      <button
        className="flex items-center justify-center w-10 h-10 mr-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none"
        style={{ margin: 0}}
        onClick={() => {
          // set the itemIndex to the previous item
          setItemIndex(Math.max(itemIndex - 1, 0));
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    )
}
  
function NextButton(props) {
    const { setItemIndex, itemIndex, maxItemIndex} = props;
    return (
      <button
        className="flex items-center justify-center w-10 h-10 mr-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none"
        onClick={() => {
          // set the itemIndez to the next item
          setItemIndex(Math.min(itemIndex + 1, maxItemIndex));
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    )
}

export {SearchButton, ModeButton, DownloadButton, PrevButton, NextButton};