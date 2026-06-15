import { useState } from 'react';

interface SpecificationsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  const [specs, setSpecs] = useState<Record<string, string>>(() => {
    try {
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  });

  const handleAddSpec = () => {
    const newSpecs = { ...specs, [`spec_${Object.keys(specs).length + 1}`]: '' };
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs, null, 2));
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs, null, 2));
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    
    const newSpecs = { ...specs };
    const value = newSpecs[oldKey];
    delete newSpecs[oldKey];
    newSpecs[newKey] = value;
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs, null, 2));
  };

  const handleValueChange = (key: string, newValue: string) => {
    const newSpecs = { ...specs, [key]: newValue };
    setSpecs(newSpecs);
    onChange(JSON.stringify(newSpecs, null, 2));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Specifications
        </label>
        <button
          type="button"
          onClick={handleAddSpec}
          className="text-sm text-[#c8a96e] hover:text-[#b0955e]"
        >
          + Add Specification
        </button>
      </div>

      {Object.keys(specs).length === 0 ? (
        <div className="text-sm text-gray-500 italic">
          No specifications. Click "Add Specification" to add one.
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(specs).map(([key, value]) => (
            <div key={key} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleKeyChange(key, e.target.value)}
                  placeholder="Specification name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleValueChange(key, e.target.value)}
                  placeholder="Value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8a96e] text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSpec(key)}
                className="text-red-600 hover:text-red-700 px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
