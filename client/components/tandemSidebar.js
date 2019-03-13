import {Template} from 'meteor/templating';
import {settings} from 'meteor/rocketchat:settings';
import './tandemSidebar.html';
import SimpleList from './react/SideBar/SideBar';


Template.tandemSidebar.onCreated(function () {

})
;

Template.tandemSidebar.rendered = function () {

};

Template.tandemSidebar.helpers({
	TandemSidebar() {
		return SimpleList;
	}
});
