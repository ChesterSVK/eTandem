import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Blaze from 'meteor/gadicc:blaze-react-component';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {getUserPreference} from 'meteor/rocketchat:utils';


import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoComplete } from 'meteor/mizzao:autocomplete';
import { callbacks } from 'meteor/rocketchat:callbacks';
import { t, roomTypes } from 'meteor/rocketchat:utils';
import { hasAllPermission } from 'meteor/rocketchat:authorization';

import {Meteor} from 'meteor/meteor';
import {settings} from 'meteor/rocketchat:settings';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import toastr from 'toastr';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';


const styles = ({
  dialogRoot: {},
  dialogContent: {
      padding: 0,
  },
  avatarHolder: {
      maxWidth: "320px",
      margin: "auto",
  },
  dialogUserName: {
      textAlign: "center",
      padding: "0.3em 1.3em",
  },
  listItem: {
      padding: "16px 2em"
  },
  card: {
    maxWidth: 336,
    minWidth: 168,
    minHeight: 288,
    maxHeight: 576,
    margin: 5
  },
  media: {
    minHeight: 168,
  },
  h6: {
    fontSize: 16,
  },
  subh: {
    fontSize: 13,
  }
});


function getSymetricLanguage(matchingLangs, matchingLang) {
    if (matchingLangs.length === 1){
        return t('symetric_language_undefied');
    }
    return matchingLangs[0] === matchingLang ? matchingLangs[1] : matchingLangs[0];
}

function createChannel(match) {
    const users = [Meteor.user().username, match.teacher.username];
    const matchingLanguage = match.matchingLanguage;
    const symetricLanguage = getSymetricLanguage(match.languagesInMatch, matchingLanguage);
    const name = '[' + matchingLanguage + '] ' + match.teacher.username + ' - ' + Meteor.user().username + ' [' + symetricLanguage + ']';
    const readOnly = false;


    Meteor.call('createPrivateGroup', name, users, readOnly, {}, {topic : t("tandem_room_topic",{ lang1: matchingLanguage, lang2: symetricLanguage })}, function(err, result) {
        if (err) {
            if (err.error === 'error-invalid-name') {
                toastr.error(t("error-invalid-name"), t("error-invalid-name"));
            }
            if (err.error === 'error-invalid-room-name') {
                toastr.error(t("error-invalid-room-name",{ room_name: name }), t("error-invalid-room-name", { room_name: name }));
            }
            if (err.error === 'error-duplicate-channel-name') {
                toastr.error(t("error-duplicate-channel-name", { channel_name: name }), t("error-duplicate-channel-name", { channel_name: name }));
            }
        }
        else {
            Meteor.call('tandemUserMatches/createMatchingRequest', match, result.rid, (error, result) => {
                if (error){
                    toastr.error(t("error-creating-user-match"));
                }
                else {
                    toastr.success(t("success-creating-user-match"));
                    return FlowRouter.go('group', { name: name }, FlowRouter.current().queryParams);
                }
            });
        }
    });
    return false;
}

class MatchProfileModal extends React.Component {
    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
      this.setState({open: false});
    };

    handleRequest = (match) => {
        createChannel(match);
        this.setState({open: false});
    };

    getTeachersLanguage = (langs, lang) => {
        if (langs.length !== 2) return "";
        if (langs[0] === lang) return langs[1];
        if (langs[1] === lang) return langs[0];
    };

    render() {
        const {classes} = this.props;


        return (
            <div>
              <Card className={classes.card}>
                <CardActionArea
                  onClick={this.handleClickOpen}>
                  <Blaze template="avatar"
                          username={this.props.match.teacher.username}/>
                  <CardContent>
                    <Typography className={classes.h6} gutterBottom variant="h6" component="h2">
                        {this.props.match.teacher.username}
                    </Typography>
                    {/*<Typography className={classes.subh} component="p">*/}
                        {/*University  name here*/}
                    {/*</Typography>*/}
                    <Typography className={classes.subh} component="p">
                        {t("looks_for")} {this.getTeachersLanguage(this.props.match.languagesInMatch, this.props.match.matchingLanguage)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Dialog
                  className={classes.dialogRoot}
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
              >
                  <DialogContent className={classes.dialogContent}>
                      <Typography variant="h4" gutterBottom className={classes.dialogUserName}>
                          {this.props.match.teacher.name}
                      </Typography>
                      <span className="match-modal__status">
                      <div
                          className={"match-modal__status-bullet sidebar__header-status-bullet--" + this.props.match.teacher.status}/>
                      </span>
                      <div className={classes.avatarHolder}>
                          <Blaze template="avatar"
                                  username={this.props.match.teacher.username}/>
                      </div>
                      <List component="nav">
                          <ListItem className={classes.listItem}>
                              <ListItemText secondary={t("teaches")}/>
                              <ListItemText primary={this.props.match.matchingLanguage}/>
                          </ListItem>
                          <ListItem className={classes.listItem}>
                              <ListItemText secondary={t("looks_for")}/>
                              <ListItemText primary={this.getTeachersLanguage(this.props.match.languagesInMatch, this.props.match.matchingLanguage)} />
                          </ListItem>
                      </List>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleClose} color="primary">
                          {t("Back")}
                      </Button>
                      <Button onClick={ () => this.handleRequest(this.props.match)} color="primary" autoFocus>
                          {t("request_conversation")}
                      </Button>
                  </DialogActions>
              </Dialog>
            </div>
        )
            ;
    }
}

MatchProfileModal.propTypes = {
    classes: PropTypes.object.isRequired,
    username: PropTypes.string
};

export default withStyles(styles)(MatchProfileModal);
