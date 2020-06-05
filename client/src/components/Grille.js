import React, { Fragment ,useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AudioPlayer from 'react-h5-audio-player';
//import 'react-h5-audio-player/lib/styles.css';


import axios from 'axios';

import LinearProgress from '@material-ui/core/LinearProgress';



import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';

import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import RenderText from './renderText'
import ContainedButtons from './ContainedButtons'
import "./DsApi.css"



import Typography from '@material-ui/core/Typography';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    input: {
        display: 'none',
    },
    buttons: {
        margin: theme.spacing(1),
    },
    uploads: {
        '& > *': {
            margin: theme.spacing(1),
          },
    },
    sidePanel: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));

export default function Grille(props) {

    const classes = useStyles();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Fren afaylu n yimesli');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const renderRecognitionOutput = () => {
        return (<List className='list'>
            {props.contenu.map((r) => {
                return (<ListItem className="message" key={r.id}>{r.text.charAt(0).toUpperCase() + r.text.slice(1)}</ListItem>);
            })}
        </List>)
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

            setMessage('Yuli-d ufaylu');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };













    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={8}>

                    <Grid container spacing={1}>
                        <Grid item xs={12}>

                            <Paper className={classes.root}>
                                <Tabs value={value}
                                    onChange={handleChange}
                                    //aria-label="simple tabs example"
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Asekles usrid" {...a11yProps(0)} />
                                    <Tab label="Afaylu n yimesli" {...a11yProps(1)} />

                                </Tabs>

                                <TabPanel value={value} index={0}>
                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-end"
                                        alignItems="stretch"
                                    >

                                        <Box component="span" overflow="auto"
                                            p={1} m={1} bgcolor="background.paper"
                                            className="messagesZone"
                                        >
                                            <RenderText
                                                rend={renderRecognitionOutput()}
                                            />
                                        </Box>

                                    </Grid>
                                    <Divider />
                                    <ContainedButtons
                                        position="static"
                                        className="buttons"
                                        disStart={props.disStart}
                                        clickStart={props.clickStart}
                                        disStop={props.disStop}
                                        clickStop={props.clickStop}
                                        renderTime={props.renderTime}
                                    />

                                </TabPanel>
                                <TabPanel value={value} index={1}>



                                    <Grid
                                        container
                                        direction="column"
                                        justify="flex-end"
                                        alignItems="stretch"
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Grid
                                                container
                                                direction="column"
                                                justify="flex-end"
                                                alignItems="stretch"
                                            >
                                                <Box component="span" overflow="auto"
                                                    p={1} m={1} bgcolor="background.paper"
                                                    className="messagesZone1"
                                                >
                                                    {
                                                        uploadedFile ? (
                                                            <div >
                                                                <p>{uploadedFile.fileName ? uploadedFile.fileName.charAt(0).toUpperCase() + uploadedFile.fileName.slice(1): uploadedFile.fileName }</p>
                                                            </div>
                                                        ) : null
                                                    }
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Divider />
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="flex-start"
                                                spacing={1}
                                                className={classes.buttons}
                                            >
                                                <FormLabel component="legend">{filename}</FormLabel>
                                                <Grid
                                                    item
                                                    xs={4}
                                                    spacing={2}
                                                >



                                                    <form onSubmit={onSubmit}>


                                                        <Grid
                                                            container
                                                            direction="row"
                                                            justify="center"
                                                            alignItems="center"
                                                            className={classes.uploads}
                                                        >
                                                            <Fragment>
                                                            <input accept="audio/wav"
                                                                className={classes.input}
                                                                id="icon-button-file"
                                                                type="file"
                                                                onChange={onChange}
                                                            />
                                                            <label htmlFor="icon-button-file">
                                                                <IconButton color="secondary" aria-label="upload picture" component="span" >
                                                                    <AudiotrackIcon />
                                                                </IconButton>
                                                            </label>



                                                            <Button
                                                                type='submit'
                                                                variant="contained"
                                                                color="primary"
                                                                size="medium"
                                                            >
                                                                Sali
                                                            </Button>
                                                            </Fragment>
                                                        </Grid>
                                                        <LinearProgress variant="buffer" value={uploadPercentage} />
                                                        <Typography variant="caption">{message}</Typography>
                                                    </form>





                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={8}
                                                >

                                                    <div>
                                                        <AudioPlayer
                                                            src={"." + uploadedFile.filePath}
                                                            onPlay={e => console.log("onPlay")}

                                                        // other props here
                                                        />

                                                    </div>


                                                </Grid>

                                            </Grid>

                                        </Grid>

                                    </Grid>








                                </TabPanel>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                        </Grid>

                    </Grid>

                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={1} className={classes.sidePanel}>
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </Paper>

                </Grid>

            </Grid>
        </div >
    );
}

