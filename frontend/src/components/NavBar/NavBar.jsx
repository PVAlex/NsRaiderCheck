import React, { useState } from 'react';
import {
  Collapse, List, ListItem, ListItemText, ListSubheader, makeStyles, Typography,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'max-content',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const [isWowOpen, setWowOpen] = useState(true);
  const history = useHistory();
  const toggleWow = () => setWowOpen(!isWowOpen);
  const navigateTo = (link) => history.push(link);

  return (
    <List
      className={classes.root}
      component="nav"
      subheader={(
        <ListSubheader component="div">
          <Typography variant="h6">
            Естественный отбор
          </Typography>
        </ListSubheader>
      )}
    >
      <ListItem button onClick={toggleWow}>
        <ListItemText primary="World of warcraft" />
        {isWowOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isWowOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button onClick={() => navigateTo('/wow/profile')} className={classes.nested}>
            <ListItemText primary="Персонаж" />
          </ListItem>
          <ListItem button onClick={() => navigateTo('/wow/gear')} className={classes.nested}>
            <ListItemText primary="Снаряжение" />
          </ListItem>
          <ListItem button onClick={() => navigateTo('/wow/spec-and-covenant')} className={classes.nested}>
            <ListItemText primary="Специализация и ковенант" />
          </ListItem>
          <ListItem button onClick={() => navigateTo('/wow/reputations')} className={classes.nested}>
            <ListItemText primary="Репутация" />
          </ListItem>
          <ListItem button onClick={() => navigateTo('/wow/professions')} className={classes.nested}>
            <ListItemText primary="Профессии" />
          </ListItem>
        </List>
      </Collapse>
      <ListItem button onClick={() => navigateTo('/rio')}>
        <ListItemText primary="Rio" />
      </ListItem>
      <ListItem button onClick={() => navigateTo('/bislist')} disabled>
        <ListItemText primary="Bis list" />
      </ListItem>
    </List>
  );
};

export default NavBar;
