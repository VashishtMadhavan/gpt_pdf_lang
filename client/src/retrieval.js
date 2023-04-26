import { PrevButton, NextButton} from './buttons'
import LoadingSpinner from './spinner'
import { PDFViewer } from './viewer'

const RetrievalPageItem = (props) => {
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
              pageNumber={pageItem.metadata["page"] + 1}
            />
        </div>
      </div>
    )
  }
  
  
  
const RetrievalView = (props) => {
    const { answer, items, itemIndex, setItemIndex, isLoading } = props;
    return (
      <div>
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
            <RetrievalPageItem items={items} itemIndex={itemIndex} />
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
    )
  }

export default RetrievalView