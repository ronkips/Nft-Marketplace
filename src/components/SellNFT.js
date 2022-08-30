//This page has a function that create a provider, signer, and contract 0bject
//fetches data from smart contract
//Fetches relevanr data from IPFS via AXIOS
//has return where it returns the JSX/HTML for the page
import Navbar from './Navbar'
import { useState } from 'react'
import { uploadFileToIPFS, uploadJSONToIPFS } from '../pinata'
import Marketplace from '../Marketplace.json'
import { useLocation } from 'react-router'

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({
    name: '',
    description: '',
    price: '',
  })
  const [fileURL, setFileURL] = useState(null)
  const ethers = require('ethers')
  const [message, updateMessage] = useState('')
  const location = useLocation()

  //This function uploads the NFT image to IPFS
  async function onChangeFile(e) {
    var file = e.target.files[0]
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file)
      if (response.success === true) {
        console.log('Uploaded image to pinata:', response.pinataURL)
        setFileURL(response.pinataURL)
      }
    } catch (e) {
      console.log('Error during file uploading', e)
    }
  }
  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0]
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file)
      if (response.success === true) {
        console.log('Uploaded image to Pinata: ', response.pinataURL)
        setFileURL(response.pinataURL)
      }
    } catch (e) {
      console.log('Error during file upload', e)
    }
  }

  //This function uploads the metadata to IPDS
  async function uploadMetadataToIPFS() {
    const { name, description, price } = formParams
    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileURL) return

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    }

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON)
      if (response.success === true) {
        console.log('Uploaded JSON to Pinata: ', response)
        return response.pinataURL
      }
    } catch (e) {
      console.log('error uploading JSON metadata:', e)
    }
  }

  async function listNft(e) {
    e.preventDefault()

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS()
      //After adding your hardhat network to your metamask this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      updateMessage('please wait..uploading (may take upto 5mins)')

      //Pull the deoloyed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer,
      )

      //message the params to be send to the create NFT request
      const price = ethers.utils.parseUnits(formParams.price, 'ether')
      let listingPrice = await contract.getListPrice()
      listingPrice = listingPrice.toString()

      //Finally create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      })
      await transaction.wait()

      alert('You have successfully listed your NFT!')
      updateMessage('')
      updateFormParams({ name: '', description: '', price: '' })
      window.location.replace('/') // replaces the current history item so you can't go back to it
    } catch (e) {
      alert('upload error' + e)
    }
  }
  return (
    <div className="">
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Upload your NFT to the marketplace
          </h3>
          <div className="mb-4">
            <label
              className="block text-green-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Hilla#4563"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-green-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Hillary Infinity Collection"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({ ...formParams, description: e.target.value })
              }
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              className="block text-green-500 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (in ETH)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Min 0.01 ETH"
              step="0.01"
              value={formParams.price}
              onChange={(e) =>
                updateFormParams({ ...formParams, price: e.target.value })
              }
            ></input>
          </div>
          <div>
            <label
              className="block text-green-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image
            </label>
            <input type={'file'} onChange={''}></input>
          </div>
          <br></br>
          <div className="text-green text-center">{message}</div>
          <button
            onClick={''}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg hover:bg-blue-700"
          >
            List NFT
          </button>
        </form>
      </div>
    </div>
  )
}
