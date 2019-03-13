import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Matching from './Matching';

import Blaze from 'meteor/gadicc:blaze-react-component';


import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';


const drawerWidth = 240;

const styles = theme => ({
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    }
});


// Passed Properties:
// this.props.languageMatches = all languages matches grouped by language name
//      format =
//                 [
//                      {
//                          langName: "languageName1",
//                          teachers: Array of users
//                      },
//                      {
//                          langName: "languageName2",
//                          teachers: Array of users
//                      }
//                 ]
//
// For rendering user avatars rocketchat tempalte is used as a help like:
//<Blaze template="avatar" username={teacher.username} />



class TandemMatches extends Component {
    constructor(props) {
        super(props);

        this.classes = props.classes;
    }


    render() {
        return (
            <div>
                {this.props.languageMatches.map(item => {
                    return <div key={item.langName}>
                        <h5>CAN TEACH {item.langName}</h5>
                        <GridList cellHeight={230} className="" cols={2.5}>
                            {item.teachers.map(teacher => {
                                return <GridListTile key={teacher.username}>
                                    <Blaze template="avatar" username={teacher.username} />
                                    <GridListTileBar
                                        title={teacher.username}
                                        actionIcon={
                                            <IconButton>
                                                <StarBorderIcon/>
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            })}
                        </GridList>
                    </div>
                })}
            </div>
        )
    }
}

export default withStyles(styles)(TandemMatches);
