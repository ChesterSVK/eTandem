import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {MatchingRequestStateEnum} from "../../../../lib/helperData";
import {t, handleError} from 'meteor/rocketchat:utils';
import Divider from '@material-ui/core/Divider';
import Blaze from 'meteor/gadicc:blaze-react-component';
import Button from '@material-ui/core/Button';
import {FlowRouter} from 'meteor/kadira:flow-router';


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    listOfLanguageFriends: {
        [theme.breakpoints.up('sm')]: {
            marginLeft: 0,
            width: `100%`,
        },
    },
    card: {
        display: 'flex',
        height: 140,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
    },
    cardPending: {
        display: 'flex',
        height: 140,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        background: "linear-gradient(90deg, rgba(255,210,31,1) 0%, rgba(255,255,255,0) 7%)"
    },
    cardCompleted: {
        display: 'flex',
        height: 140,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        background: "linear-gradient(90deg, rgba(45,224,165,1) 0%, rgba(255,255,255,0) 7%)"
    },
    cardAccepted: {
        display: 'flex',
        height: 140,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        background: "linear-gradient(90deg, rgba(23,92,196,1) 0%, rgba(255,255,255,0) 7%)"
    },
    details: {
        display: 'flex',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    yourStudentsTitle: {
        paddingLeft: 15,
    },
    emptyTitle: {
        padding: 15,
    },
    tileDataAvatar: {
        marginLeft: "20px",
        width: "140px",
        height: "140px"
    }
});

class ListMatches extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.classes = props.classes;
    }

    state = {
        userMatches: []
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const matches = nextProps.matches;
        Meteor.call('tandemUserMatches/transform', matches, (error, result) => {
            if (error) {
                handleError(error);
            }
            else {
                this.setState(
                    {
                        userMatches: result
                    }
                );
            }
        });
    }

    goToRoom(roomName) {
        return FlowRouter.go('group', { name: roomName }, FlowRouter.current().queryParams);
    }


    iAmTeacherInThisMatch(tile) {
        return tile.teacher._id === Meteor.userId();
    }

    getTileDataAsStudent(tile) {
        return (<div>
            <div className={this.classes.details}>
                <div className={this.classes.tileDataAvatar}>
                    <Blaze template="avatar"
                           username={tile.student.username}/>
                </div>
                <CardContent className={this.classes.content}>
                    <Typography component="h6" variant="h6">
                        {tile.student.name} {t("match_as_student")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {t("Languages")} {tile.matchingLanguage}{tile.symetricLanguage ? ', ' + tile.symetricLanguage : ""}
                    </Typography>
                    <Button variant="contained" onClick={() => {
                        this.goToRoom(tile.roomName)
                    }} className={this.classes.button}>
                        {t("Go_To_Room")}
                    </Button>
                </CardContent>
            </div>
        </div>)
    }

    getTileDataAsTeacher(tile) {
        return (
            <div>
                <div className={this.classes.details}>
                    <div className={this.classes.tileDataAvatar}>
                        <Blaze template="avatar"
                               username={tile.teacher.username}/>
                    </div>
                    <CardContent className={this.classes.content}>
                        <Typography component="h6" variant="h6">
                            {tile.teacher.name} {t("match_as_teacher")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {t("Languages")} {tile.matchingLanguage}{tile.symetricLanguage ? ', ' + tile.symetricLanguage : ""}
                        </Typography>
                        <Button variant="contained" onClick={() => {
                            this.goToRoom(tile.roomName)
                        }} className={this.classes.button}>
                            {t("Go_To_Room")}
                        </Button>
                    </CardContent>
                </div>
            </div>
        )
    }

    getPending(matches) {
        if (matches.length === 0) {
            return (
                <div className={this.classes.emptyTitle}>
                    <Typography variant="h5">{t("No_Pending_Matches")}</Typography>
                </div>
            );
        }
        else {
            return (
                <div className={this.classes.yourStudentsTitle}>
                    <Typography variant="overline">{t("My_Pending")}</Typography>
                    {matches.map((tile, index) => (
                        <div className={this.classes.listOfLanguageFriends} key={tile.teacher.username + index}>
                            <Card className={this.classes.cardPending}>
                                {
                                    this.iAmTeacherInThisMatch(tile) ?
                                        this.getTileDataAsStudent(tile)
                                        :
                                        this.getTileDataAsTeacher(tile)
                                }
                            </Card>
                        </div>
                    ))}
                </div>

            );
        }
    }

    getCompleted(matches) {
        if (matches.length === 0) {
            return (
                <div className={this.classes.emptyTitle}>
                    <Typography variant="h5">{t("No_Completed_Matches")}</Typography>
                </div>
            );
        }
        else {
            return (
                <div className={this.classes.yourStudentsTitle}>
                    <Typography variant="overline">{t("My_Completed")}</Typography>
                    {matches.map((tile, index) => (
                        <div className={this.classes.listOfLanguageFriends} key={tile.teacher.username + index}>
                            <Card className={this.classes.cardCompleted}>
                                {
                                    this.iAmTeacherInThisMatch(tile) ?
                                        this.getTileDataAsStudent(tile)
                                        :
                                        this.getTileDataAsTeacher(tile)
                                }
                            </Card>
                        </div>
                    ))}
                </div>);
        }
    }

    getTeachers(matches) {
        if (matches.length === 0) {
            return (
                <div className={this.classes.emptyTitle}>
                    <Typography variant="h5">{t("No_Teaching_Matches")}</Typography>
                </div>
            );
        }
        else {
            return (
                <div className={this.classes.yourStudentsTitle}>
                    <Typography variant="overline">{t("My_Teachers")}</Typography>
                    {matches.map((tile, index) => (
                        <div className={this.classes.listOfLanguageFriends} key={tile.teacher.username + index}>
                            <Card className={this.classes.cardAccepted}>
                                {
                                    this.iAmTeacherInThisMatch(tile) ?
                                        this.getTileDataAsStudent(tile)
                                        :
                                        this.getTileDataAsTeacher(tile)
                                }
                            </Card>
                        </div>
                    ))}
                </div>
            );
        }
    }

    getStudents(matches) {
        if (matches.length === 0) {
            return (
                <div className={this.classes.emptyTitle}>
                    <Typography variant="h5">{t("No_Learning_Matches")}</Typography>
                </div>
            );
        }
        else {
            return (
                <div className={this.classes.yourStudentsTitle}>
                    <Typography variant="overline">{t("My_Students")}</Typography>
                    {matches.map((tile, index) => (
                        <div className={this.classes.listOfLanguageFriends} key={tile.teacher.username + index}>
                            <Card className={this.classes.cardAccepted}>
                                {
                                    this.iAmTeacherInThisMatch(tile) ?
                                        this.getTileDataAsStudent(tile)
                                        :
                                        this.getTileDataAsTeacher(tile)
                                }
                            </Card>
                        </div>
                    ))}
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.getStudents(this.state.userMatches.filter(match => match.status === MatchingRequestStateEnum.ACCEPTED && match.teacherId === Meteor.userId()))}
                <Divider/>
                {this.getTeachers(this.state.userMatches.filter(match => match.status === MatchingRequestStateEnum.ACCEPTED && match.studentId === Meteor.userId()))}
                <Divider/>
                {this.getCompleted(this.state.userMatches.filter(match => match.status === MatchingRequestStateEnum.COMPLETED))}
                <Divider/>
                {this.getPending(this.state.userMatches.filter(match => match.status === MatchingRequestStateEnum.PENDING))}
            </div>
        )
    }
}

ListMatches.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListMatches);
