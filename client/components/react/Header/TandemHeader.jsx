import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowIcon from '@material-ui/icons/KeyboardArrowLeft';
//import Link  from 'react-router-dom';


const styles = (theme) => ({
    root: {
        flexGrow: 1,
        boxShadow: 'none',
        top: '-1px'
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 1,
    },
    hamburger: {
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        }
    }
})

function TandemHeader(props) {
    const {
        classes, displayArrow, noLeftButton, backAction, title, linkTo, position = 'fixed', className, action = () => {
        }
    } = props;

    function getNavbar() {
        if (noLeftButton) {
            return null;
        }
        if (displayArrow) {
            if (backAction) {
                return (
                    <IconButton onClick={backAction} className={classes.menuButton} color="inherit" aria-label="Menu">
                        <ArrowIcon/>
                    </IconButton>
                )
            }
            else {
                return (
                    <IconButton /*component={Link} to={props.linkTo || ''} */ className={classes.menuButton}
                                                                              color="inherit" aria-label="Menu">
                        <ArrowIcon/>
                    </IconButton>
                )
            }
        }
        return (
            <IconButton className={classes.menuButton + ' ' + classes.hamburger} color="inherit" aria-label="Menu"
                        onClick={action}>
                <MenuIcon/>
            </IconButton>
        )
    }

    return (
        <AppBar position={position}
                className={classes.root + ' ' + (className ? className : '') }>
            <Toolbar>
                {getNavbar()}
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    {title}
                </Typography>

            </Toolbar>
        </AppBar>
    );
}

TandemHeader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(TandemHeader);
