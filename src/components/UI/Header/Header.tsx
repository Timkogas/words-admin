import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Header = (): React.JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: '50px' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Words admin
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header