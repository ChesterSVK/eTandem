import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


import AddBoxIcon from '@material-ui/icons/AddBox';
import {t} from 'meteor/rocketchat:utils';


import Blaze from 'meteor/gadicc:blaze-react-component';
import toastr from "toastr";
import TandemLanguages from "../../../models/TandemLanguages";
import {TeachingMotivationEnum} from "../../../../lib/teachingMotivation";
import {noLanguage, noLevel} from "../Preferences/TandemLanguageConstant";
import {preferenceScreenType, preferenceStepType} from "../Preferences/TandemPreferences";


const styles = ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    fullWidth: {
        width: "100%",
    },
    bottomMargin: {
        marginBottom: '2.5em',
    },
    title: {
        color: '#fff',
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    preferencesLink: {
        color: '#3f51b5'
    },
    cardContent: {
        padding: '0'
    },
    gridListTile: {
        height: "100% !important",
        maxWidth: "300px",
    },
    gridListTileBar: {
        background: "#3f51b5",
    },
});


class TandemMatches extends React.Component {
    state = {
        languageMatches: [],
        open: false,
    };

    componentWillReceiveProps(nextProps) {
        const matches = nextProps.languageMatches;

        this.setState(
            {
                languageMatches: matches
            }
        );
    }

    //click save button
    handleSaveLanguages = () => {
        if (this.state.step === preferenceStepType.study) {
            Meteor.call('tandemUserLanguages/setPreferences', this.state.pickedLanguages, TeachingMotivationEnum.WTLEARN, success(() => toastr.success(t("Message_Saving_Preference"), t("Title_Saving_Preference"))));
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({selectedValue: value, open: false});
    };

// <h4>{t("CAN_TEACH")}: {item.languageName}</h4>,

    render() {
        const {classes} = this.props;


        return (
            <div className={classes.root}>

                <List component="nav" className={classes.fullWidth}>


                    {
                        this.state.languageMatches.map(item => {
                                return (<ListItem key={item.languageName}
                                                  className={classes.fullWidth + ' ' + classes.bottomMargin} button>
                                    <div className={classes.fullWidth} key={item.languageName}>
                                        <div className={classes.fullWidth}>
                                            <ListItemText className={classes.bottomMargin}>
                                                <Typography variant="overline" gutterBottom>
                                                    {t("Can_teach") + ' ' + item.languageName + ":"}
                                                </Typography>
                                            </ListItemText>
                                        </div>
                                        {
                                            item.teachers.length === 0 ? (
                                                <Typography variant="h5" gutterBottom>
                                                    <Typography variant="overline" gutterBottom>
                                                        {t("No_matches_found_for")} {item.languageName}
                                                    </Typography>
                                                    <Link href="/languagePreferences" className={classes.preferencesLink}>
                                                        {t("Edit_your_preferences")}
                                                    </Link>
                                                </Typography>
                                            ) : (
                                                <div className={classes.fullWidth}>
                                                    <GridList className={classes.gridList} cols={3}>
                                                        {
                                                            item.teachers.map(teacher =>
                                                                <GridListTile key={teacher.username}
                                                                              className={classes.gridListTile}>
                                                                    <Card className={classes.card}>
                                                                        <CardContent className={classes.cardContent}>
                                                                            <Blaze template="avatar"
                                                                                   username={teacher.username}/>
                                                                            <GridListTileBar
                                                                                className={classes.gridListTileBar}
                                                                                title={teacher.username}
                                                                                actionIcon={
                                                                                    <IconButton
                                                                                        onClick={this.handleClickOpen}>
                                                                                        <AddBoxIcon
                                                                                            className={classes.title}/>
                                                                                    </IconButton>
                                                                                }
                                                                            />
                                                                        </CardContent>
                                                                    </Card>
                                                                </GridListTile>
                                                            )
                                                        }
                                                    </GridList>
                                                </div>)
                                        }
                                    </div>
                                </ListItem>)
                            }
                        )
                    }
                </List>
            </div>
        );

    }


}


TandemMatches.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TandemMatches);


// Passed Properties:
// this.props.languageMatches = all languages matches grouped by language name
//      format =
//                 [
//                      {
//                          languageName: "Lang name"
//                          languagePreference: {_id, credits, motivation, levelId, langId, userId},
//                          teachers: Array of users
//                      },
//                      {
//                          languageName: "Lang name"
//                          languagePreference: {_id, credits, motivation, levelId, langId, userId},
//                          teachers: Array of users
//                      }
//                 ]
//
// For rendering user avatars rocketchat tempalte is used as a help like:
//<Blaze template="avatar" username={teacher.username} />
