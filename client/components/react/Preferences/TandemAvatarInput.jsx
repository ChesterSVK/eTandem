import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const styles = theme => ({
    input: {
        display: 'none',
    },
    button: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 50,
        height: 50
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200,
        height: 200
    },
});



class AvatarInput extends React.Component {
    state = {
        file : ''
    }

    handleChange = (event) => {
        const url = URL.createObjectURL(event.target.files[0]);
        this.setState({
            file: url
        })

        this.props.onChange(url);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                    {/* <IconButton color="primary"
                    className={classes.button}
                    component="span"
                    href="http://suikero.tech:3000/account/profile"
                    target="_blank">
                        <PhotoCamera />
                    </IconButton>     */}


                    <IconButton className={classes.button}
                    color="primary"
                    size="big"
                    href="/account/profile"
                                    target="_blank">
                                    <PhotoCamera />
                                </IconButton>
            </div>
        );
    }
}

AvatarInput.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AvatarInput);
