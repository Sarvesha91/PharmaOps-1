import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectThemeMode, toggleTheme } from '../../features/ui/uiSlice';

type Props = {
  onToggleSidebar: () => void;
};

const TopNav = ({ onToggleSidebar }: Props) => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);

  return (
    <AppBar position="fixed" color="inherit" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            PharmaOps
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {mode === 'dark' ? <WbSunnyIcon /> : <ShieldMoonIcon />}
          </IconButton>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;

