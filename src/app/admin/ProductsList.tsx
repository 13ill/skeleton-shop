import { useState } from 'react';
import { CategoryPriority } from './CategoryPriority';
import { GlobalProductOrder } from './GlobalProductOrder';

export function ProductsList() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<'interleaved' | 'grouped'>('interleaved');

  const handlePreview = () => {
    // Open customer view in new tab
    window.open('/', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Display Order Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => setDisplayMode('interleaved')}
            className={`px-4 py-2 rounded-md transition-colors ${displayMode === 'interleaved'
              ? 'bg-[#c8a96e] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Interleaved
          </button>
          <button
            onClick={() => setDisplayMode('grouped')}
            className={`px-4 py-2 rounded-md transition-colors ${displayMode === 'grouped'
              ? 'bg-[#c8a96e] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Grouped
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Priority */}
        <div className="lg:col-span-1">
          <CategoryPriority
            onCategorySelect={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
        </div>

        {/* Right: Global Product Order */}
        <div className="lg:col-span-2">
          <GlobalProductOrder
            categoryId={selectedCategoryId || undefined}
            displayMode={displayMode}
          />
        </div>
      </div>
    </div>
  );
}
