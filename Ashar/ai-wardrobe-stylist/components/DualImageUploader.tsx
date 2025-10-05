import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons';
import Spinner from './Spinner';

interface DualImageUploaderProps {
  onWardrobeUpload: (files: File[]) => void;
  onPersonalPhotoUpload: (file: File) => void;
  isCategorizing: boolean;
}

const DualImageUploader: React.FC<DualImageUploaderProps> = ({ 
  onWardrobeUpload, 
  onPersonalPhotoUpload, 
  isCategorizing 
}) => {
  // Wardrobe upload state
  const [wardrobeFiles, setWardrobeFiles] = useState<File[]>([]);
  const [wardrobePreviews, setWardrobePreviews] = useState<string[]>([]);
  const wardrobeInputRef = useRef<HTMLInputElement>(null);

  // Personal photo upload state
  const [personalPhotoFile, setPersonalPhotoFile] = useState<File | null>(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState<string>('');
  const personalPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleWardrobeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setWardrobeFiles(files);

      const newPreviews = files.map((file: File) => URL.createObjectURL(file));
      setWardrobePreviews(newPreviews);
    }
  };

  const handlePersonalPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPersonalPhotoFile(file);
      setPersonalPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleWardrobeUploadClick = () => {
    if (wardrobeFiles.length > 0) {
      onWardrobeUpload(wardrobeFiles);
      setWardrobeFiles([]);
      setWardrobePreviews([]);
    }
  };

  const handlePersonalPhotoUploadClick = () => {
    if (personalPhotoFile) {
      onPersonalPhotoUpload(personalPhotoFile);
      setPersonalPhotoFile(null);
      setPersonalPhotoPreview('');
    }
  };
  
  const triggerWardrobeFileSelect = useCallback(() => {
    wardrobeInputRef.current?.click();
  }, []);

  const triggerPersonalPhotoSelect = useCallback(() => {
    personalPhotoInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-8">
      {/* Step 1: Upload Personal Photo */}
      <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#ff3cac]/20">
        <h2 className="text-xl font-semibold text-[#f7f8fb] mb-4 flex items-center">
          <UploadIcon className="w-6 h-6 mr-2 text-[#ff3cac]" />
          Step 1: Upload Your Photo
        </h2>
        <div 
          onClick={triggerPersonalPhotoSelect}
          className="border-2 border-dashed border-[#ff3cac]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#ff3cac]/50 transition-colors bg-[#0b0f1a]/50"
        >
          <input
            ref={personalPhotoInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePersonalPhotoChange}
            className="hidden"
            disabled={isCategorizing}
          />
          <UploadIcon className="w-12 h-12 mx-auto text-[#ff3cac]/60" />
          <p className="mt-2 text-sm text-[#b6c3d9]">Upload your personal photo for outfit recommendations</p>
          <p className="text-xs text-[#b6c3d9]/60">PNG, JPG, WEBP accepted (single photo)</p>
        </div>

        {personalPhotoPreview && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-[#f7f8fb]">Your Photo:</h3>
            <div className="mt-2 flex justify-center">
              <img 
                src={personalPhotoPreview} 
                alt="Personal photo preview" 
                className="w-32 h-32 object-cover rounded-lg shadow-sm border border-[#ff3cac]/30" 
              />
            </div>
            <button
              onClick={handlePersonalPhotoUploadClick}
              disabled={isCategorizing || !personalPhotoFile}
              className="mt-4 w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-[#ff3cac] to-[#7c3aed] text-white font-semibold rounded-md shadow-lg hover:shadow-[#ff3cac]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Personal Photo
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Upload Wardrobe */}
      <div className="bg-[#05060a]/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-[#00f5d4]/20">
        <h2 className="text-xl font-semibold text-[#f7f8fb] mb-4 flex items-center">
          <UploadIcon className="w-6 h-6 mr-2 text-[#00f5d4]" />
          Step 2: Upload Your Clothes
        </h2>
        <div 
          onClick={triggerWardrobeFileSelect}
          className="border-2 border-dashed border-[#00f5d4]/30 rounded-lg p-8 text-center cursor-pointer hover:border-[#00f5d4]/50 transition-colors bg-[#0b0f1a]/50"
        >
          <input
            ref={wardrobeInputRef}
            type="file"
            multiple
            accept="image/jpeg, image/png, image/webp"
            onChange={handleWardrobeFileChange}
            className="hidden"
            disabled={isCategorizing}
          />
          <UploadIcon className="w-12 h-12 mx-auto text-[#00f5d4]/60" />
          <p className="mt-2 text-sm text-[#b6c3d9]">Drag & drop your clothing photos here, or click to select files</p>
          <p className="text-xs text-[#b6c3d9]/60">PNG, JPG, WEBP accepted (multiple photos)</p>
        </div>

        {wardrobePreviews.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-[#f7f8fb]">Selected Clothing Items ({wardrobeFiles.length}):</h3>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {wardrobePreviews.map((preview, index) => (
                <img 
                  key={index} 
                  src={preview} 
                  alt={`wardrobe preview ${index}`} 
                  className="w-24 h-24 object-cover rounded-md shadow-sm border border-[#00f5d4]/30" 
                />
              ))}
            </div>
            <button
              onClick={handleWardrobeUploadClick}
              disabled={isCategorizing || wardrobeFiles.length === 0}
              className="mt-6 w-full flex justify-center items-center px-4 py-2 bg-gradient-to-r from-[#ff3cac] to-[#00f5d4] text-white font-semibold rounded-md shadow-lg hover:shadow-[#00f5d4]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isCategorizing ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Categorizing...
                </>
              ) : (
                'Categorize Wardrobe Items'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DualImageUploader;
