import React from 'react'
import FileUpload from './FileUpload'


const LeftBox = () => {
  return (
    <div className="left-box">
        <div className='content-ocr'>
            <h5>VIETNAMESE OPTICAL CHARACTER RECOGNITION
            PLEASE UPLOAD YOUR IMAGE JPG , JPGE , PNG .... with file_name not file name        
            </h5>
      
        </div>
        <FileUpload />
    </div>
  )
}

export default LeftBox