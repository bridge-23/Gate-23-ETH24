import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { convertToDataURL } from "./image";
import { resizeAndGrayscaleImage } from './resizeAndGrayscaleImage';
import { nft_minter_backend } from "declarations/nft_minter_backend";

const UploadNFT = (props) => {
  const [storeName, setStoreName] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageByteArray, setImageByteArray] = useState();
  const [imageLink, setImageLink] = useState("");
  const [uploadedDataURL, setUploadedDataURL] = useState("");

  const reset = () => {
    setStoreName("");
    setProductName("");
    setProductPrice("");
    setQuantity("");
    setImageByteArray(null);
    setImageLink("");
    setSelectedFile(null);
    setUploadedDataURL('');
  };

  const handleFileChange = async (
    event
  ) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      const grayImage = await resizeAndGrayscaleImage(event.target.files[0])
      const arrayBuffer = await grayImage.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);
      setImageByteArray(byteArray);
      const chunks = [];
      chunks.push(new Uint8Array(byteArray));

      const blob = new Blob(chunks, { type: "image/jpeg" });

      let new_url = (await convertToDataURL(blob));
      setImageLink(new_url);
    }
  };

  const handleMintNFT = async () => {
    const docKey = nanoid();
    const imageResult = await nft_minter_backend.upload_image(
      docKey,
      imageByteArray
    );
    const uploadedImageUrl = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/image/${imageResult}`;

    const formData = {
      storeName,
      productName,
      productPrice: Number(productPrice),
      quantity: Number(quantity),
      selectedFileName: selectedFile ? selectedFile.name : "",
      imageURL: uploadedImageUrl,
    };
    const jsonData = JSON.stringify(formData);
    const dataResult = await nft_minter_backend.upload_data(docKey, jsonData);
    const uploadedDataUrl = `https://tkuag-tqaaa-aaaak-akvgq-cai.raw.icp0.io/receipt/${dataResult}`;
    setUploadedDataURL(uploadedDataUrl);
    console.log("uploadedDataUrl: ", uploadedDataUrl);
  };

  return (
    <div className="bg-gray-800 p-4 max-w-2xl mx-auto my-8 rounded-lg text-gray-400 flex flex-col gap-4">
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-5 flex flex-col justify-start h-full">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer w-full aspect-square flex flex-col items-center justify-center text-center"
          >
            Upload Image
          </label>
          {selectedFile && (
            <div className="flex-grow flex items-center">
              <p className="text-gray-300 text-center my-auto w-full">
                {selectedFile.name}
              </p>
            </div>
          )}
        </div>
        <img
          src={imageLink}
          className="col-span-7 aspect-square rounded-lg border-[2px] border-blue-600"
        />
      </div>

      <input
        type="text"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        placeholder="Store Name"
        className="bg-gray-700 border-gray-600 rounded-md p-2 text-gray-300"
      />

      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Product Name"
        className="bg-gray-700 border-gray-600 rounded-md p-2 text-gray-300"
      />

      <input
        type="text"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        placeholder="Product Price"
        className="bg-gray-700 border-gray-600 rounded-md p-2 text-gray-300"
      />

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="bg-gray-700 border-gray-600 rounded-md p-2 text-gray-300"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => reset()}
          className="bg-gray-700 text-white py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleMintNFT}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Add item
        </button>
      </div>
      {uploadedDataURL && <p>Uploaded Data URL: <a href={uploadedDataURL} target="_blink" className="underline">{uploadedDataURL}</a></p>}
    </div>
  );
};

export default UploadNFT;
