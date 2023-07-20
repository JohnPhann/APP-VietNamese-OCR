import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [isSuccess , setIsSuccess] = useState(false);
  const [isError , setIsError] = useState(false);
  
  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };
  const data = {
    pic : file
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
   
    // Send the file to the server using a fetch request or an Axios post request
    try {
      await axios.post('http://127.0.0.1:9000/api/picture/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      localStorage.setItem('file',data.pic.name);
      console.log('File uploaded successfully!');
      setIsSuccess(true)
      
    } catch (error) {
      setIsError(true)
      console.error(error);
    }
    // Clear the file input
    // event.target.reset();
    // setFile(null);
  };
  setTimeout(() => {
    setIsSuccess(false)
    setIsError(false)
  }, 1000);

  return (
    <div className='up-load-file'>
    <form onSubmit={handleSubmit}>
      <div class="file-drop-area">
        <span class="choose-file-button">Choose Files</span>
        <span class="file-message">or drag and drop files here</span>
        <input type="file" onChange={handleFileUpload} class="file-input" accept=".jfif,.jpg,.jpeg,.png,.gif" multiple />
      </div>
      <div id="divImageMediaPreview">

	    </div>
      <button className='fancy-btn' type="submit" disabled={!file}>
        Upload
      </button>
    </form>
      <div className='alert-notifications'>
      <h5>{isSuccess ? (
        <button type="button" class="btn btn-success"> Upload Success !</button>
      ) : ''}</h5>
      <h5>{isError ? (<button type="button" class="btn btn-danger"> Upload Error , Please Upload Again !</button>) : ''}</h5>
      </div>
    </div>
      
  );
}

export default FileUpload;