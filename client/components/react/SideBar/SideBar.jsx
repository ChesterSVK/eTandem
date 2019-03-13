import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListIcon from '@material-ui/icons/List';
import PeopleIcon from '@material-ui/icons/People';

const styles = theme => ({
    root: {
        width: '100%',
    },
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

// Routes defined in 'client/routes/router.js'

function SimpleList(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <List component="nav">
                <h3 className={"rooms-list__type"}>
                    <ListItemLink href="/languagePreferences" className={"sidebar-item"}>
                        <ListItemIcon>
                            <ListIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Preferences"/>
                    </ListItemLink>
                </h3>
            </List>
            <List component="nav">
                <h3 className={"rooms-list__type"}>
                    <ListItemLink href="/languageMatches" className={"sidebar-item"}>
                        <ListItemIcon>
                            <PeopleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Matches"/>
                    </ListItemLink>
                </h3>
            </List>
            <Divider/>
        </div>
    );
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);
