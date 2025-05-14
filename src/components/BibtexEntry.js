import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined'; // MUI copy icon
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Optional: for success indication

const BibtexEntry = ({ bibtexString }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(bibtexString)
            .then(() => {
                setCopied(true);
                setSnackbarOpen(true);
                setTimeout(() => setCopied(false), 2500); // Reset copied visual cue after 2.5s
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                // You could set an error state and show an error Snackbar here
            });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                <Box fontWeight={500}>BibTex Reference</Box>
            </Typography>
            <Box
                sx={{
                    backgroundColor: (theme) => theme.palette.grey[100], // Use theme colors
                    padding: 2, // theme.spacing(2)
                    borderRadius: 1, // theme.shape.borderRadius
                    fontFamily: 'monospace',
                    position: 'relative',
                    border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                    '&:hover .copy-button': { // Show button on hover (optional)
                        opacity: 1,
                    },
                }}
            >
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="top">
                    <IconButton
                        aria-label="copy bibtex"
                        onClick={handleCopy}
                        className="copy-button" // For hover effect if used
                        sx={{
                            position: 'absolute',
                            top: (theme) => theme.spacing(1),
                            right: (theme) => theme.spacing(1),
                            // opacity: 0.7, // Make it slightly transparent until hover (optional)
                            // transition: 'opacity 0.2s', // For smooth hover effect
                            color: copied ? 'success.main' : 'action.active', // Use theme colors
                        }}
                    >
                        {copied ? <CheckCircleOutlineIcon fontSize="small" /> : <FileCopyOutlinedIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
                <Typography
                    component="pre"
                    variant="body2" // Or another variant as you see fit
                    sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: 0,
                        paddingRight: 5, // Ensure text doesn't overlap with button
                        fontFamily: 'monospace', // Reinforce monospace
                        fontSize: '0.875rem', // Default for body2, adjust if needed
                        color: (theme) => theme.palette.text.secondary,
                    }}
                >
                    {bibtexString}
                </Typography>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000}
                    onClose={handleSnackbarClose}
                    message="BibTeX copied to clipboard!"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </div>

    );
};

export default BibtexEntry;