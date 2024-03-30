import React, { useState } from 'react';

const UploadNFT = () => {
    const [storeName, setStoreName] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formDataJson, setFormDataJson] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleMintNFT = () => {
        const formData = {
            storeName,
            productName,
            productPrice: Number(productPrice),
            quantity: Number(quantity),
            selectedFileName: selectedFile ? selectedFile.name : '',
        };

        const jsonData = JSON.stringify(formData, null, 2);
        setFormDataJson(jsonData);

        console.log(jsonData);
    };

    return (
        <div className="bg-gray-800 p-4 max-w-2xl mx-auto my-8 rounded-lg text-gray-400 flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                />
                <label htmlFor="fileInput" className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">
                    Upload Media
                </label>
                {selectedFile && <span className="text-gray-300">{selectedFile.name}</span>}
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
                <button onClick={() => setStoreName('')} className="bg-gray-700 text-white py-2 px-4 rounded-lg">
                    Cancel
                </button>
                <button onClick={handleMintNFT} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                    Mint NFT
                </button>
            </div>
        </div>
    );
};

export default UploadNFT;
