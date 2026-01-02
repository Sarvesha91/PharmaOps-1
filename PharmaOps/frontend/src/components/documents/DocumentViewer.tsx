import { Box, Typography } from '@mui/material';

type Props = {
  documentTitle: string;
  version: string;
};

const DocumentViewer = ({ documentTitle, version }: Props) => (
  <Box
    sx={{
      borderRadius: 2,
      border: '1px dashed',
      borderColor: 'divider',
      p: 3,
      textAlign: 'center',
      minHeight: 240,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 1,
    }}
  >
    <Typography variant="subtitle1" fontWeight={600}>
      {documentTitle}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Version {version}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      PDF rendering powered by PDF.js will appear here once a document is selected.
    </Typography>
  </Box>
);

export default DocumentViewer;

