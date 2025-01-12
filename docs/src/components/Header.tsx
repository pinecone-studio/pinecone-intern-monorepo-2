import { AppBar, Toolbar } from '@mui/material';
import { DRAWER_WIDTH } from '../libs/constants';

export const Header = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar></Toolbar>
    </AppBar>
  );
};
