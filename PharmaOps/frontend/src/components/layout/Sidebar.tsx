import { type ReactNode } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { NavLink } from 'react-router-dom';

import { NAV_ITEMS } from '../../constants/navigation';

const iconByPath: Record<string, ReactNode> = {
  '/': <DashboardIcon />,
  '/documents': <DescriptionIcon />,
  '/logistics': <LocalShippingIcon />,
};

type Props = {
  width: number;
  open: boolean;
};

const Sidebar = ({ width, open }: Props) => (
  <Drawer
    variant="persistent"
    open={open}
    sx={{
      width,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width,
        boxSizing: 'border-box',
        borderRight: '1px solid rgba(0,0,0,0.08)',
      },
    }}
  >
    <Toolbar />
    <List>
      {NAV_ITEMS.map((item) => (
        <ListItemButton
          key={item.path}
          component={NavLink}
          to={item.path}
          sx={{
            '&.active': {
              bgcolor: 'action.selected',
            },
          }}
        >
          <ListItemIcon>{iconByPath[item.path]}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;

