import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box } from '@mui/material';

const BibtexEntry = ({ bibtexString }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(bibtexString)
      .then(() => {
        setCopied(true);
        setSnackbarOpen(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
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
          backgroundColor: (theme) => theme.palette.grey[100],
          padding: 2,
          borderRadius: 1,
          fontFamily: 'monospace',
          position: 'relative',
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          '&:hover .copy-button': {
            opacity: 1,
          },
        }}
      >
        <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'} placement="top">
          <IconButton
            aria-label="copy bibtex"
            onClick={handleCopy}
            className="copy-button"
            sx={{
              position: 'absolute',
              top: (theme) => theme.spacing(1),
              right: (theme) => theme.spacing(1),
              color: copied ? 'success.main' : 'action.active',
            }}
          >
            {copied ? (
              <CheckCircleOutlineIcon fontSize="small" />
            ) : (
              <FileCopyOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Typography
          component="pre"
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
            paddingRight: 5,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
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

BibtexEntry.propTypes = {
  bibtexString: PropTypes.string.isRequired,
};

export default BibtexEntry;
