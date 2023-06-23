import React, {useState} from 'react';

export const UploadFile = ({ isAdmin, onNewSchedule }) => {

  const [selectedFile, setSelectedFile] = useState();


	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = () => {
    console.log('submitting...')
  	const formData = new FormData();

  	formData.append('file', selectedFile);

  	fetch(
  		'https://vm-www3build:53872/update_schedule',
  		{
  			method: 'POST',
        body: formData
  	  }
    ).then(response => response.json())
     .then(data => onNewSchedule(data));
  }

  if(isAdmin) {
  	return(
      <div className='tr'>
      	<input type="file" name="file" onChange={changeHandler} />
      	<button onClick={handleSubmission}>Submit</button>
      </div>
  	)
  }else{
    return(
      <div className='tr'>
      </div>
    )
  }
}


//TODO add onClick={() => onRouteChange('signin')}  back to admin button after testing
