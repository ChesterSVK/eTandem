import {Meteor} from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListIcon from '@material-ui/icons/List';
import SchoolIcon from '@material-ui/icons/School';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PeopleIcon from '@material-ui/icons/People';

const styles = theme => ({
    root: {
        width: '100%',
    },
    userName: {
        textAlign: "center",
        fontSize: "1.5em",
        marginBottom: "1em"
    },
    no_padding : {
        padding : '0',
    },
    no_padding_bottom : {
        paddingBottom : '0',
    },
    divider : {
        marginBottom : '0.8em',
    }
});

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

// Routes defined in 'client/routes/router.js'

function SimpleList(props) {
    const {classes} = props;
    return (
        <div className={classes.root}>
            <h3 className={classes.userName}>
                {Meteor.user().name}
            </h3>
            <Divider className={classes.divider} />
            <List component="nav" className={classes.no_padding}>
                <h4 className={"rooms-list__type " + classes.no_padding_bottom}>
                    <ListItemLink href="/languagePreferences" className={"sidebar-item tandem-link"} >
                        <ListItemIcon>
                            <ListIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Preferences"/>
                    </ListItemLink>
                </h4>
            </List>
            <List component="nav">
                <h3 className={"rooms-list__type " + classes.no_padding_bottom}>
                    <ListItemLink href="/languageMatches" className={"sidebar-item tandem-link"}>
                        <ListItemIcon>
                            <PeopleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Matches"/>
                    </ListItemLink>
                </h3>
            </List>
            <List component="nav">
                <h3 className={"rooms-list__type " + classes.no_padding_bottom}>
                    <ListItemLink href="https://learning2.uta.fi/?lang=en" target="_blank" className={"sidebar-item tandem-link"}>
                        <ListItemIcon>
                            <SchoolIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Moodle"/>
                    </ListItemLink>
                </h3>
            </List>
            { props.showStudentsLink &&
                <List component="nav">
                    <h3 className={"rooms-list__type " + classes.no_padding_bottom}>
                        <ListItemLink href="/listStudents" className={"sidebar-item tandem-link"}>
                            <ListItemIcon>
                                <AssignmentIndIcon/>
                            </ListItemIcon>
                            <ListItemText primary="My students"/>
                        </ListItemLink>
                    </h3>
                </List>
            }
            <Divider/>
        </div>
    );
}

SimpleList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleList);
