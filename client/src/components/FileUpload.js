import React, { Fragment, useState } from 'react';
//import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));


const FileUpload = () => {
  const classes = useStyles();

  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose Audio File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>     
      <form onSubmit={onSubmit}>
        <FormLabel component="legend">{filename}</FormLabel>
        
        <div className='custom-file mb-4'>

          <input accept="audio/wav"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={onChange}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="upload picture" component="span">
              <AudiotrackIcon />
            </IconButton>
          </label>



          <Button
            type='submit'
            variant="contained"
            color="primary"
          >
            Upload
          </Button>

        </div>
        <FormLabel component="legend">{message}</FormLabel>
        <Progress percentage={uploadPercentage} />
      </form>
      {
        uploadedFile ? (
          <div className='row mt-5'>
            <div className='col-md-6 m-auto'>
              <h3 className='text-center'>{uploadedFile.fileName}</h3>              
            </div>
          </div>
        ) : null
      }
    </Fragment >
  );
};

export default FileUpload;
