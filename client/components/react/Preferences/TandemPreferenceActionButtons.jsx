import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import { preferenceScreenType, preferenceStepType } from './TandemPreferences';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { t } from 'meteor/rocketchat:utils';

const styles = {
    button: {
        width: 100,
        float: 'right',
        margin: 16,

    },

    text:{
        float: 'left',
        margin: 16
    }
}

class PreferenceActionButtons extends Component {

    render() {
        const { classes } = this.props;

        let page = null;
        // if (this.props.type === preferenceScreenType.firstTime) {
        //     let stepString = "1/2";
        //     if (this.props.step === preferenceStepType.study){
        //         stepString = "2/2";
        //     }
        //     page = (<div>
        //         <Typography className={classes.text}  variant="h6">
        //             {stepString}
        //         </Typography>
        //
        //         <Button type="submit"
        //             fullWidth
        //             variant="contained"
        //             color="primary"
        //             className={classes.button}
        //             onClick={this.props.handleNext}
        //         >{t("Next")}
        //         </Button>
        //
        //         <Button type="submit"
        //             fullWidth
        //             variant="text"
        //             color="secondary"
        //             className={classes.button}
        //             onClick={this.props.handleBack}
        //         >{t("Back")}
        //         </Button>
        //     </div>);
        // }
        // else
        //     if (this.props.type === preferenceScreenType.setting) {
            page = (<div>
                <Button type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.props.handleSave}
                >{t("Save")}
                </Button>
            </div>);
        // }

        return page;
    }
}

export default withStyles(styles)(PreferenceActionButtons);
