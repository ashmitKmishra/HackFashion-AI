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
    <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#00f5d4]/20">
      <h2 className="text-xl font-semibold text-[#f7f8fb] mb-4 flex items-center">
        <UploadIcon className="w-6 h-6 mr-2 text-[#00f5d4]" />
        Step 1: Upload Your Clothes
      </h2>
      <div 
        onClick={triggerFileSelect}
        className="border-2 border-dashed border-[#00f5d4]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#ff3cac]/50 transition-colors bg-[#0b0f1a]/50"
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
        <UploadIcon className="w-12 h-12 mx-auto text-[#00f5d4]/60" />
        <p className="mt-2 text-sm text-[#b6c3d9]">Drag & drop your photos here, or click to select files</p>
        <p className="text-xs text-[#b6c3d9]/60">PNG, JPG, WEBP accepted</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-[#f7f8fb]">Selected Images:</h3>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {previews.map((preview, index) => (
              <img key={index} src={preview} alt={`preview ${index}`} className="w-24 h-24 object-cover rounded-md shadow-sm border border-[#00f5d4]/30" />
            ))}
          </div>
          <button
            onClick={handleUploadClick}
            disabled={isCategorizing || selectedFiles.length === 0}
            className="mt-6 w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] text-white font-semibold rounded-md shadow-lg hover:shadow-[#00f5d4]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
