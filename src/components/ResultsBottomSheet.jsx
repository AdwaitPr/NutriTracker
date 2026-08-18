import { BentoGrid } from './BentoGrid';
import { Loader2 } from 'lucide-react';

export const ResultsBottomSheet = ({ isOpen, onClose, data, isLoading, error }) => {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-md mx-auto max-h-[85vh] overflow-y-auto flex flex-col">
        {/* Pull-down handle indicator */}
        <div
          className="sticky top-0 bg-white pt-4 pb-2 flex justify-center cursor-pointer z-10 rounded-t-3xl"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        <div className="px-6 pb-8 pt-2 flex flex-col flex-grow">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
               <p className="text-gray-600 font-medium">Analyzing food...</p>
             </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 text-center mt-4">
              <p className="mb-4">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
              >
                Dismiss
              </button>
            </div>
          ) : data ? (
            <>
              <div className="mb-6">
                <h2 className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Identified As</h2>
                <h3 className="text-2xl font-black text-gray-900 capitalize">{data.itemName}</h3>
              </div>

              <BentoGrid data={data} />
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
