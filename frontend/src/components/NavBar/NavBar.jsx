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
  const [isBisOpen, setBisOpen] = useState(true);
  const history = useHistory();
  const toggleWow = () => setWowOpen(!isWowOpen);
  const toggleBis = () => setBisOpen(!isBisOpen);
  const navigateTo = (link) => history.push(link);

  return (
    <List
      className={classes.root}
      component="nav"
      subheader={(
        <ListSubheader component="div">
          <Typography variant="h6">
            Йота
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
          <ListItem button onClick={() => navigateTo('/wow/equipment')} className={classes.nested}>
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
      <ListItem button onClick={toggleBis}>
        <ListItemText primary="Bis list" />
        {isBisOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isBisOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button onClick={() => navigateTo('/bislist/equipment')} className={classes.nested}>
            <ListItemText primary="Снаряжение" />
          </ListItem>
          <ListItem button onClick={() => navigateTo('/bislist/bosses')} className={classes.nested}>
            <ListItemText primary="Боссы" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default NavBar;
