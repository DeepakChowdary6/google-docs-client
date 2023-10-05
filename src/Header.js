import React from 'react';
import Button from "@mui/material/Button";
import ShareIcon from '@mui/icons-material/Share';
import {useState} from "react";
import './styles.css'
import {Typography} from "@mui/material";
import { MenuItem, Select } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {IconButton} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';

function Header(props) {
    const [isCopied, setIsCopied] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Edit');

    function copyCurrentUrlToClipboard() {
        // Get the current URL
        const currentUrl = window.location.href;// Attempt to copy the URL to the clipboard

        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setIsCopied(true); // URL copied successfully
                setTimeout(() => setIsCopied(false), 2000); // Hide the notification after 2 seconds
            })
            .catch((error) => {
                console.error('Failed to copy URL to clipboard:', error);
            });
    }
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);

        try{
            if(event.target.value==='Edit'){
                props.quill.enable(true);
            }else if(event.target.value==='View'){
                props.quill.enable(false);
            }
        }
        catch (e){
            console.log(e);
        }
        console.log(selectedOption);
    };
    return (
        <div style={{display:"flex",justifyContent:"space-evenly"}}>
          <div style={{display:"flex",justifyContent:"flex-start",alignItems:"center"}}>
            <Typography style={{position:'relative',top:'3px'}}>
                <DescriptionIcon fontSize='large' style={{ color: "#2785fc" }}/>
            </Typography> <h style={{fontFamily:'Roboto',fontSize:'1.75em'}}>Google Docs</h></div>

            <div>
                <Tooltip title="Create New Document" arrow>
                <IconButton onClick={()=>{
                    window.open('/');
                }}>
                    <NoteAddIcon style={{ color: "#2785fc" }}/>
                </IconButton>
                 </Tooltip>
                <Select
                    value={selectedOption}
                    onChange={handleOptionChange}
                  style={{height:'30px',margin:'5px', borderRadius: '30px'}}>
                    <MenuItem  value="Edit">Edit</MenuItem>
                    <MenuItem  value="View">View</MenuItem>
                </Select>
            <Button style={{height:'30px', borderRadius: '30px'}} variant="outlined" endIcon={<ShareIcon/>} onClick={copyCurrentUrlToClipboard}>Share</Button>
            {isCopied && (
                alert('Link Copied to Clipboard')
            )}
            </div>

        </div>
    );
}

export default Header;