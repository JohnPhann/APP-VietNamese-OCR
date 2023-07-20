import React, { useState } from 'react'
import axios from 'axios';



const RightBox = () => {
    
    const [texts , setTexts] = useState([]);
    const [isLoading , setIsLoading] = useState();


    const handleProcess = async (event) => {
      const value = localStorage.getItem("file");
      const string = {
        str : value
      };
      if(value !== null){
      setIsLoading(true)
      try {
        await axios.post('http://127.0.0.1:8000/api/recognize/', string, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
          
        }).then(response => {
          console.log(response.data)
          setTexts(response.data);
          setIsLoading(false)
        });
        
        console.log('Recognize successfully!');
      } catch (error) {
        setIsLoading(false)
        alert("Error Recognize , please upload image again !!!")
      }
    }
    
  }
    const refreshAll = (event) => {
      if(isLoading === false){
        setTexts([])
        localStorage.clear();
      } 
    }

    const handleCopyClick = () => {
      if(isLoading === false){
      navigator.clipboard.writeText(texts).then(
        () => {
          alert("Copied!");
        },
      );
      }
    };

  return (
    <div className='right-box'>
      <div className='content'>
        {isLoading ? 
        (
        <img src="https://i.gifer.com/YCZH.gif" alt="Loading..."  />
        )
        :(
          <div className='adasd'>
          {texts.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
          </div>
        )}
        
      </div>
      <div className='copy-refresh'>
      <button onClick={handleProcess} className='fancy-btn' type="submit">
        Process Image
      </button>
      <button onClick={handleCopyClick} className='fancy-btn' type="submit">
        Copy Text
      </button>
      <button onClick={refreshAll} className='fancy-btn' type="submit">
        Refresh Text
      </button>
      </div>
    </div>
  )
}

export default RightBox