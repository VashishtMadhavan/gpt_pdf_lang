import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs} from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const api_endpoint = 'http://localhost:8000/';
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
      <div className="flex items-center justify-center col-span-2">
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

export { PDFViewer, TextViewer};