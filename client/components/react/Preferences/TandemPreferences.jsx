import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

import PreferenceItem from './TandemPreferenceItem.jsx';
import TandemHeader from '../Header/TandemHeader.jsx';
import TandemLanguages from '../../../models/TandemLanguages';
import PreferenceActionButtons from './TandemPreferenceActionButtons';

import {t, handleError} from 'meteor/rocketchat:utils';
import toastr from 'toastr';

import StudyLanguagesInput from './TandemStudyLanguagesInput';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import {themeColor} from '../Utilities/Constants'

export const preferenceScreenType = {"setting": 1, "firstTime": 2};
export const preferenceStepType = {"general": 1, "teach": 2, "study": 3};

import {noLanguage, noLevel} from './TandemLanguageConstant'
import {TeachingMotivationEnum} from "../../../../lib/teachingMotivation";


const success = function success(fn) {
    return function(error, result) {
        if (error) {
            return handleError(error);
        }
        if (result) {
            fn.call(this, result);
        }
    };
};

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
        color: themeColor.primary,
        'font-size': '14px'
    },
    scroll: {
        overflow: 'auto',
        whiteSpace: 'nowrap',
        margin: 8,
        height: 320
    },
    submit: {
        width: 100,
        float: 'right',
        margin: 16,

    }
}

class TandemPreferences extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state.type = props.type;
    //     if (props.type === preferenceScreenType.firstTime) {
    //         this.state.step = preferenceStepType.teach;
    //     }
    //     else if (props.type === preferenceScreenType.setting) {
    //         this.state.step = preferenceStepType.general;
    //     }
    // }

    state = {
        type: preferenceScreenType.setting,
        step: preferenceStepType.general,
        teachLanguages: [], //credits, langId, levelId, motivation, userId, _id
        studyLanguages: [], //credits, langId, levelId, motivation, userId, _id

        pickedLanguages: [] //credits, langId, levelId, motivation, userId, _id
    };

    componentWillReceiveProps(nextProps) {
        const teachLanguages = nextProps.teachingLangs;
        const studyLanguages = nextProps.learningLangs;

        let step = preferenceStepType.general;
        let type = preferenceScreenType.setting;
        // if (teachLanguages.length === 0) {
        //     step = preferenceStepType.teach;
        // } else
        if (studyLanguages.length === 0) {
            step = preferenceStepType.study;
            type = preferenceScreenType.firstTime;
        }

        this.setState(
            {
                teachLanguages: teachLanguages,
                studyLanguages: studyLanguages,
                step: step,
                type: type
            }
        );
    }

    backHandler = () => {
        switch (this.state.step) {
            case preferenceStepType.general: {
                //this.props.history.goBack();
                break;
            }
            case preferenceStepType.teach: {
                this.setState({
                    step: preferenceStepType.general
                });
                break;
            }
            case preferenceStepType.study: {
                this.setState({
                    step: preferenceStepType.general
                });
                break;
            }
        }
    }

    editTeachLanguageHandler = () => {
        this.setState({
            step: preferenceStepType.teach
        });
    }

    editStudyLanguageHandler = () => {
        const pickedLanguages = [...this.state.studyLanguages];
        this.setState({
            step: preferenceStepType.study,
            pickedLanguages: pickedLanguages
        });
    }

    //handle when select value from drop down box
    changeStudyLanguageHandler = (language, level, credit, index) => {
        var pickedLanguages = [...this.state.pickedLanguages];
        if (index === pickedLanguages.length) {
            if (language != noLanguage && level != noLevel && credit != 0) {
                pickedLanguages.push({language: language, level: level, credit: credit});
                this.setState({
                    pickedLanguages: pickedLanguages
                });
            }
        }
        if (index < pickedLanguages.length) {
            if (language != noLanguage && level != noLevel && credit > 0) {
                pickedLanguages[index] = {langId: language._id, levelId: level._id, credits: credit};
                this.setState({
                    pickedLanguages: pickedLanguages
                });
            }
            else {
                console.log(index);
                pickedLanguages.splice(index, 1);
                this.setState({
                    pickedLanguages: pickedLanguages
                });
            }
        }
    }

    //click save button
    handleSaveLanguages = () => {
        // if (this.state.step === preferenceStepType.teach) {
        //     this.setState({
        //         step: preferenceStepType.general
        //     });
        // }
        // else
        if (this.state.step === preferenceStepType.study) {
            Meteor.call('tandemUserLanguages/setPreferences', this.state.pickedLanguages, TeachingMotivationEnum.WTLEARN, success(() => toastr.success(t("Message_Saving_Preference"), t("Title_Saving_Preference"))));
        }
    }

    render() {
        const {classes} = this.props;
        let page = null;


        switch (this.state.step) {
            case preferenceStepType.general: {
                let teachLanguagesString = this.state.teachLanguages.map((languageData) => TandemLanguages.findById(languageData.langId).name).join(", ");
                let studyLanguagesString = this.state.studyLanguages.map((languageData) => TandemLanguages.findById(languageData.langId).name).join(", ");

                page = (
                    <div>

                        <PreferenceItem title={t("I_can_teach")}
                                        content={teachLanguagesString}
                                        action={this.editTeachLanguageHandler}/>
                        <PreferenceItem title={t("I_want_to_learn")}
                                        content={studyLanguagesString}
                                        action={this.editStudyLanguageHandler}/>
                    </div>
                );
                break;
            }

            case preferenceStepType.teach: {
                page = (
                    <div>
                        <TandemHeader title={t("Preferences_T")} displayArrow={true} backAction={this.backHandler}/>

                    </div>
                )
                break;
            }
            case preferenceStepType.study: {
                const studyInputList = this.state.pickedLanguages.map((language) =>
                    <StudyLanguagesInput
                        key={this.state.pickedLanguages.indexOf(language)}
                        index={this.state.pickedLanguages.indexOf(language)}
                        changeStudyLanguageValue={this.changeStudyLanguageHandler}
                        languageId={language.langId}
                        levelId={language.levelId}
                        credit={language.credits}
                        pickedLanguages={this.state.pickedLanguages}
                    />
                );

                page = (
                    <div>
                        <TandemHeader title={t("Preferences_L")} displayArrow={true} backAction={this.backHandler}/>
                        <div className={classes.infoButtonContainer}>
                            <Tooltip title={t("info_about_language_levels")}
                                     aria-label={t("info_about_language_levels")}>
                                <IconButton className={classes.infoButton} size="big"
                                            href="https://en.wikipedia.org/wiki/Common_European_Framework_of_Reference_for_Languages#Common_reference_levels"
                                            target="_blank">
                                    <InfoIcon fontSize="large" color="secondary"/>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div>
                            <h3 className={classes.title}>{t("preference_item_input_header")}</h3>
                            <p className={classes.note}>{t("language_max_study")}</p>
                        </div>
                        <div className={classes.scroll}>
                            {studyInputList}
                            <StudyLanguagesInput index={this.state.pickedLanguages.length}
                                                 changeStudyLanguageValue={this.changeStudyLanguageHandler}
                                                 languageId={0}
                                                 levelId={0}
                                                 credit={0}
                                                 pickedLanguages={this.state.pickedLanguages}
                            />
                        </div>
                        <PreferenceActionButtons
                            type={this.state.type}
                            step={this.state.step}
                            handleSave={this.handleSaveLanguages}
                            handleNext={this.handleNext}
                            handleBack={this.backHandler}
                        />
                    </div>
                );
                break;
            }
        }


        return page;
    }


}

TandemPreferences.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TandemPreferences);


