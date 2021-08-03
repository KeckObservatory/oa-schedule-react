import React, {useState} from 'react';

export const UploadFile = ({ onRouteChange, isSignedIn, onNewSchedule }) => {

  const [selectedFile, setSelectedFile] = useState();


	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmission = () => {
    console.log('submitting...')
  	const formData = new FormData();

  	formData.append('file', selectedFile);

  	fetch(
  		'http://localhost:5000/update_schedule',
  		{
  			method: 'POST',
        body: formData
  	  }
    ).then(response => response.json())
     .then(data => onNewSchedule(data));
  }

  if(isSignedIn) {
  	return(
      <div className='tr'>
      	<input type="file" name="file" onChange={changeHandler} />
      	<button onClick={handleSubmission}>Submit</button>
        <span onClick={() => onRouteChange('signout')} className='tr f3 link dim black underline pa3 pointer'>Sign Out</span>
      </div>
  	)
  }else{
    return(
      <div className='tr'>
        <span onClick={() => onRouteChange('signin')} className=' tr f3 link dim black underline pa3 pointer'>Sign In</span>
      </div>
    )
  }
}



//   return (
//     <Button
//       onClick={async () => {
//         const response = await fetch('/update_schedule', {
//           method: 'POST'
//         });
//         if (response.ok) {
//           console.log("response worked")
//       }
//     }}
//     >
//       submit
//     </Button>
//   )
// }
