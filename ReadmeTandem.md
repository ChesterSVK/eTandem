
#Tandem Integration

## DATA:

> ##### server IP:
>    157.230.105.20
> ##### SFTP:
>    developerFTP , developerFTP, port : 22
> ##### ssh:
>    developer , developer
> ##### server root:
>    root, klkrisek1
> ##### rocket.chat admin:
>    SUIKKIS, klkrisek1

##Folders 
>  ##### Server code folder
>    ~/sftpRoot/Rocket.Chat.Original/
>  ##### Server deploy (Needs to be created)
>    ~/sftpRoot/Rocket.Deploy/
> 
# 1. Modify deploy run script:

```
#!/bin/bash
set -x
set -euvo pipefail
IFS=$'\n\t'

# Requires Node.js version 4.x
# Do not run as root

DEPLOY_DIR=/home/developer/sftpRoot/Rocket.Deploy

### BUILD
meteor npm install
meteor npm run postinstall

# on the very first build, meteor build command should fail due to a bug on emojione package (related to phantomjs installation)
# the command below forces the error to happen before build command (not needed on subsequent builds)
set +e
meteor add rocketchat:lib
set -e

meteor build --server-only --directory $DEPLOY_DIR

### RUN
cd $DEPLOY_DIR/bundle/programs/server
npm install

cd $DEPLOY_DIR/bundle
NODE_ENV=production \
PORT=3000 \
ROOT_URL=http://suikero.tech:3000 \
MONGO_URL=mongodb://localhost:27017/rocketchat \
MONGO_OPLOG_URL=mongodb://localhost:27017/local?replSet=rs01 \
node main.js
```

# 2. Create development run script eTandem-build.sh, to be able to do reactive and quick changes to the running instance
    
```
#!/bin/bash
NODE_ENV=developement \
PORT=3000 \
ROOT_URL=http://suikero.tech:3000 \
MONGO_URL=mongodb://localhost:27017/rocketchat \
MONGO_OPLOG_URL=mongodb://localhost:27017/local?replSet=rs01 \
meteor npm start
```


# 3. Start the script, login as admin, change configuration:

>###Permissions for User:
>>####Removed:
>>>#####Create Public Channels
>>>#####View Public Channel
>>>#####Mention All
>>>#####Mention here
>>>#####Create private channel
>>>#####Create direct messages

>###Rooms:
>>####Delete general room

>###Accounts:
>>####Default Directory Listing:
>>> #####Users
>>####Default User Preferences:
>>> #####Group By Type:
>>>> ######False

>###General:
>>####Enable Favourite Rooms:
>>> #####False

>###Layout:
>>####User Interface:
>>>#####Group Channels by type:
>>>> ######False
>>>#####Click to create direct message:
>>>> ######False
>>####Colors:
>>>>#####Primary:
>>>>>###### #ffffff
>>####Custom CSS:
>>>>
```
   .sidebar__header{
      	display: block;
      }
      .sidebar__toolbar{
        display: block; width: 100%; margin: 0; text-align: center;
      }
      .sidebar__header-thumb{
        display:block; margin: 1em auto; height: 140px; width: 140px;
      }
      .sidebar__header-status-bullet{
      	width: 152px;
          height: 152px;
          bottom: -6px;
          right: -6px;
          border-radius: 0;
          position: absolute;
          z-index: -1;
        	border: 0;
      }
      .sidebar__footer{
        text-align: center;
        height : 63px !important;
        background-color: #3f51b5;
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
      }
      .rc-header__block{
        margin: 0;
      }
      .rc-old .page-container .content {
      	display: block;
      }
  	.sidebar{
  	
        	box-shadow: 
            0px 2px 4px -1px rgba(0,0,0,0.2), 
            0px 4px 5px 0px rgba(0,0,0,0.14), 
            0px 1px 10px 0px rgba(0,0,0,0.12);
      
        	background-color: #fff;
  	   
  	}
  
  
  	
      @media only screen and (max-width: 500px) {
       	.sidebar__header-thumb{
        		height: 100px; width: 100px;
      	}
      	.sidebar__header-status-bullet{
          	width: 112px;
             	height: 112px;
          }
      }
```

>###Logs
>>####Log Level:
>>> #####2
>>####Show package:
>>> #####true
>>####Show file:
>>> #####true
>>####Trace:
>>> #####true

>###Messages
>>####Messages to yourself:
>>> #####false
>>####Hex preview:
>>> #####false
>>####Autolinker:
>>> #####false
>>####Katex - Enabled: 
>>> #####false
>###Setup Wizard Organizational info: *
># Nice details configuration to think about:
>>###Emails
>>###Layout



# 4. Add react support
> `meteor npm install --save react react-dom prop-types @material-ui/core @material-ui/icons history`

> `meteor add react-template-helper`

> `meteor add gadicc:blaze-react-component`

# 5. Add Tandem Package
> ###Repo: `https://github.com/ChesterSVK/eTandem/tree/rocketchat-tandem-package`

>> clone or copy to `packages/rocketchat-tandem` folder 

> ###Install:
>> ```meteor add rocketchat:tandem```

>> Do not forget to rebuild



#6. Modify rocketchat files

>###Tandem routing, modify home route and add preferences and matchmaking route
>>`client/routes/router.js`
```
// Tandem
FlowRouter.route('/home', {
	name: 'home',

	action(params, queryParams) {
		KonchatNotification.getDesktopPermission();
		if (queryParams.saml_idp_credentialToken !== undefined) {
			Accounts.callLoginMethod({
				methodArguments: [{
					saml: true,
					credentialToken: queryParams.saml_idp_credentialToken,
				}],
				userCallback() {
					FlowRouter.go('/languageMatches');
				},
			});
		} else {
			FlowRouter.go('/languageMatches');
		}
	},
});

// Tandem
FlowRouter.route('/languageMatches', {
	name: 'langMatches',

	action(params, queryParams) {
		Meteor.call('tandemUserLanguages/hasSomePreferences', (error, result) => {
			if (!result){
				FlowRouter.go('/languagePreferences');
			}
			else {
				BlazeLayout.render('main', {center: 'tandemLanguageMatches'});
			}
		});
	},
});


// Tandem
FlowRouter.route('/languagePreferences', {
	name: 'langPreferences',

	action(params, queryParams) {
		BlazeLayout.render('main', {center: 'tandemLanguagePreferences'});
	},
});
```
>>*Method tandemUserLanguages/hasSomePreferences defined in `rocketchat-tandem/server/methods`

>###Tandem sidebar section, with click event 
>>`packages/rocketchat-sidenav/client/sideNav.html`
```
<!--Tandem-->
<div class="tandem-links">
    {{> tandemSidebar }}
</div>
```
>>`packages/rocketchat-sidenav/client/sideNav.js`
```
...
    // Tandem
	'click .tandem-preference-link'(e) {
		// Prevent default browser form submit
		e.preventDefault();

		// Get value from form element
		const target = e.target;
		const href = target.getAttribute("href");

		FlowRouter.go(href);
	},
...


    //Tandem
    // const userPref = getUserPreference(user, 'sidebarGroupByType');
	const userPref = getUserPreference(user, 'sidebarGroupByType', false);
...
```

>###Tandem sidebar avatar
>>Switched avatar position with buttons position and put footer on top of the sidebar element in
>>`packages/rocketchat-sidenav/client/sidebarHeader.html`

>###Modify user sidebar options according to permissions with checks
>>`packages/rocketchat-sidenav/client/sidebarHeader.js`
```
    ...
    const toolbarButtons = (user) => [{
    	name: t('Search'),
    	icon: 'magnifier',
    	condition: () => hasAtLeastOnePermission(['tandem-search']),
    	action: () => {
    		toolbarSearch.show(false);
    	},
    },
    {
    	name: t('Directory'),
    	icon: 'discover',
    	condition: () => hasAtLeastOnePermission(['tandem-view-directory']),
    	action: () => {
    		menu.close();
    		FlowRouter.go('directory');
    	},
    },
    
    ...
    
    {
    	name: t('Sort'),
    	icon: 'sort',
    	condition: () => hasAtLeastOnePermission(['tandem-ui-sort']),
    	action: (e) => {
    		const options = [];
    		const config = {
    			template: 'sortlist',
    			currentTarget: e.currentTarget,
    			data: {
    				options,
    			},
    			offsetVertical: e.currentTarget.clientHeight + 10,
    		};
    		popover.open(config);
    	},
    },
    ...
```

>###Added unmatch possibility, which is modified eraseRoom function
>>`packages/rocketchat-sidenav/client/sidebarItem.js`
```
...

        // Tandem
		const canUnmatch = () => {
			if (!hasAtLeastOnePermission('tandem-unmatch')) { return false; }
			else return true;
		};

		// Tandem
		if (canUnmatch()) {
			items.push({
				icon: 'sign-out',
				name: t('Unmatch conversation'),
				type: 'sidebar-item',
				id: 'unmatch',
				modifier: 'error',
			});
		}

...

```

>>`packages/rocketchat-ui-utils/client/lib/popover.js`
```
...
import { hide, leave, unmatch } from './ChannelActions';
...
// Tandem
		if (action === 'unmatch') {
			unmatch(template, rid, name);
		}
...

```
>>`packages/rocketchat-ui-utils/client/lib/ChannelActions.js`
```
...
// Tandem
export async function unmatch(type, rid, name) {
	modal.open({
		title: t('Are_you_sure'),
		text: t('Delete_Room_Warning'),
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: t('Yes_delete_it'),
		cancelButtonText: t('Cancel'),
		closeOnConfirm: false,
		html: false,
	}, async function(isConfirm) {
		if (!isConfirm) {
			return;
		}
		try {
			await call('eraseRoom', rid);
		} catch (error) {
			return modal.open({
				type: 'error',
				title: t('Warning'),
				text: handleError(error, false),
				html: false,
			});
		}
		try {
			await call('unmatchRoom', rid);
			modal.open({
				title: t('Deleted'),
				text: t('Room_has_been_deleted'),
				type: 'success',
				showConfirmButton: true,
				confirmButtonText: t('OK'),
			}, function () {
				document.location.reload(true);
			});
		} catch (error) {
			return modal.open({
				type: 'error',
				title: t('Warning'),
				text: handleError(error, false),
				html: false,
			});
		}

	});
}

...
```
>>>>*Method unmatch defined in `rocketchat-tandem/server/methods`


>###Added reporting user with email to tandem admins

>>`packages/rocketchat-ui-flextab/package.js`
```
```
>>`packages/rocketchat-ui-flextab/client/tabs/userActions.js`
```
...
// Tandem
import {hasAllPermission, hasRole} from 'meteor/rocketchat:authorization';
...

		// Tandem
    	const canReportUser = () => hasPermission('tandem-report-user', Session.get('openedRoom'));
    	
...
//Add to action functions array 

// Tandem
		, () => {
			if (!canReportUser()) {
				return;
			}
			return {
				group: 'channel',
				icon: 'warning',
				name: t('Report_user'),
				action: prevent(getUser, ({username}) => {
					const rid = Session.get('openedRoom');
					const room = ChatRoom.findOne(rid);
					if (!hasPermission('tandem-report-user')) {
						return toastr.error(TAPi18n.__('error-not-allowed'));
					}
					modal.open({
							title: t('Are_you_sure'),
							text: t('Reason?'),
							type: 'input',
							inputType: 'text',
							showCancelButton: true,
							confirmButtonColor: '#DD6B55',
							confirmButtonText: t('Yes_report_user'),
							cancelButtonText: t('Cancel'),
							closeOnConfirm: false,
							html: false,
						}, (reason) => {
							Meteor.call('reportUserInRoom', {rid, username, reason}, success(() => {
								modal.open({
									title: t('Reported'),
									text: t('User_has_been_reported'),
									type: 'success',
									timer: 2000,
									showConfirmButton: false,
								});
							}))
						},
					);
				}),
			};
		}

```
>>method defined in tandem-package/server/methods/reportUserInRoom.js

>###Added translation files

>>`packages/rocketchat-i18n/i18n/rokcetchat-tandem.en.i18n.json`



#Tandem developer notes
>##React with [react-template-helper](https://atmospherejs.com/meteor/react-template-helper)
>Package `rocketchat-tandem` uses React combined with Blaze components which was decided solely for learning
purposes to gain more React experience. Base views are defined in `rockechat-tandem/client/views` folder,
 which are blaze templates calling react components with additional data: (in .html blaze template)
 
 >` {> React component=FunctionReturningComponent data=functionReturiningData}`

>##Blaze with [blaze-react-component](https://atmospherejs.com/gadicc/blaze-react-component)
 >There is also added possibility to call blaze templates and helper templates defined in other rocketchat source files: (in .jsx file template, render() method )
 
 > `<Blaze template="templateName" data={dataNeededByThisTemplate} />` 
> Meteor [Documentation](https://guide.meteor.com/react.html) for this issues

>##Material-UI
>Added [Material-UI](https://material-ui.com/) support. Just import the right component like:
>`import {ComponentName} from '@material-ui/...'`

>### All react ui elements are in the `rocketchat-tandem/client/components/react` folder


>#Warning
> Passing reactive data from blaze template to react component works, but passing the same variable data from THE react 
component to some child react component seems to throw undefined error. Reason: bug or bad usage of the code and variables, or insufficient knowledge :/ :D  


#Rocketchat developer suggestions


>###Import bug
>>RoomManager is in ui-utils
>>`packages/rocketchat-ui-message/client/messageBoxAudioMessage`
```
import { AudioRecorder, chatMessages } from 'meteor/rocketchat:ui';
import { RoomManager } from 'meteor/rocketchat:ui-utils';
```
>>Reported as an [issue 137445](https://github.com/RocketChat/Rocket.Chat/issues/13745)


 - permissions-manager .content - display block
