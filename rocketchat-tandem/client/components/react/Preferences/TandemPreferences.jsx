import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    infoButtonContainer: {
        height: '50px'
    },
    infoButton: {
        position: 'absolute',
        right: '16px'
    },
    title: {
        textAlign: 'center'
    },
    note: {
        textAlign: 'center',
        color: '#343fe7',
        'font-size': '14px'
    },
    scroll: {
        overflow: 'auto',
        whiteSpace: 'nowrap',
        margin: 8,
        height: 350
    },
    submit: {
        width: 100,
        float: 'right',
        margin: 16,

    }
}

// Passed Properties:
// this.props.learningLanguages = all languages that I (user) want to learn
//      entity format =
//                      {
//                          _id: id,
//                          userId: userId,
//                          motivation: "WTTEACH" or "WTLEARN"  defined in 'rocketchat-tandem/lib/teachingMotivation.js',
//                          langName: language name,
//                          credits: credits TODO in backend,
//                      }
// this.props.teachingLanguages = all languages that I (user) want to teach
//      entity format =
//                      {
//                          _id: id,
//                          userId: userId,
//                          motivation: "WTTEACH" or "WTLEARN"  defined in 'rocketchat-tandem/lib/teachingMotivation.js',
//                          langName: language name,
//                          credits: credits TODO in backend,
//                      }
// this.props.languages = all tandem languages
//      entity format =
//                      {
//                          _id: tdl_eng,
//                          code: eng,
//                          name: English,
//                      }
// this.props.languageLevels = from A1 to C2
//      entity format =
//                      {
//                          _id: tdll_a1,
//                          level: "A1",
//                      }

class TandemPreferences extends React.Component {


    render() {
        return (
            <div>
                Learning Preferences
                <br/>
                {this.props.learningLangs.map(item => {
                    return <li key={item._id} id={item._id}>{item.langName}</li>;
                })}
                <br/>
                Teaching Preferences
                <br/>
                {this.props.teachingLangs.map(item => {
                    return <li key={item._id} id={item._id}>{item.langName}</li>;
                })}
                <br/>
                Languages
                <br/>
                {this.props.languages.map(item => {
                    return <li key={item._id} id={item._id}>{item.name}</li>;
                })}
                <br/>
                Levels
                <br/>
                {this.props.levels.map(item => {
                    return <li key={item._id} id={item._id}>{item.level}</li>;
                })}
            </div>
        );
    }



}

TandemPreferences.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(TandemPreferences);


