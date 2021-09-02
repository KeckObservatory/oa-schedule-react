import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const IndividualDownload = ({names}) => {

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const individualDownload = (name) => {
    fetch(
      'http://98.151.209.95:5000/get-employee-schedule',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "employee": name
          })
      }
    ).then(response => {
      const filename =  name + '.csv';
      response.blob()
       .then(blob => {
         let url = window.URL.createObjectURL(blob);
         let a = document.createElement('a');
         a.href = url;
         a.download = filename;
         a.click();
       })
     })
    closeModal()
  }

  return (
    <div>
      <button onClick={openModal}>Download Individual Schedule</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2>Choose a schedule to download</h2>
        {names.map(name => {
          return(<button value={name.id} onClick={(e) => {
            individualDownload(name.id, e)
            }}>{name.id}</button>)
        })}
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
}
