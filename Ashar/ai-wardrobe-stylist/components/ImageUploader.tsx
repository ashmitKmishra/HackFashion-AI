import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';
import Spinner from './Spinner';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  isCategorizing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, isCategorizing }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
      setPreviews([]);
    }
  };
  
  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <UploadIcon className="w-6 h-6 mr-2 text-indigo-500" />
        Step 1: Upload Your Clothes
      </h2>
      <div 
        onClick={triggerFileSelect}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={isCategorizing}
        />
        <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Drag & drop your photos here, or click to select files</p>
        <p className="text-xs text-gray-500">PNG, JPG, WEBP accepted</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700">Selected Images:</h3>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt={`preview ${index}`} className="w-24 h-24 object-cover rounded-md shadow-sm" />
            ))}
          </div>
          <button
            onClick={handleUploadClick}
            disabled={isCategorizing || selectedFiles.length === 0}
            className="mt-6 w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCategorizing ? (
              <>
                <Spinner className="w-5 h-5 mr-2" />
                Categorizing...
              </>
            ) : (
              'Categorize Items'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
