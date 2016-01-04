const AppDispatcher = require('../dispatcher/AppDispatcher');
const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const StepmasterUtils = require('../utils/StepmasterUtils');

const CHANGE_EVENT = 'change';

var stepmaster = [];
var filteredIndexes = [];
var filters = {
		processid: "",
		stepseq: "",
		stepdesc: "",
		ppid: ""
};
var names = {
	"processid" : "Process ID",
	"stepseq" : "Step Seq",
	"stepdesc" : "Step Desc",
	"ppid" : "PPID"
};
var dimensions = {
	height: 500,
	width: 800
};


function setStepmaster(stepArray){
	for(var i=0; i<stepArray.length; i++){
	    stepmaster.push(stepArray[i]);
	    filteredIndexes.push(i);
	}
}
function setFilter(filtertype, value){
	filters[filtertype] = value.toLowerCase();
	filter();
}
function filter(){
	//resets filteredIndexes based on values in filters object
	var size = stepmaster.length;
	filteredIndexes = [];
	for (var index = 0; index < size; index++){
		if(StepmasterUtils.filterTest(stepmaster[index], filters)){
			filteredIndexes.push(index);
		}
	}
}
function setHeight(height){
	dimensions.height = height;
}
function emitChange(){
	StepmasterStore.emit(CHANGE_EVENT);
}

var StepmasterStore = assign({}, EventEmitter.prototype, {
	addChangeListener: function(callback){
		this.on(CHANGE_EVENT, callback);
	},
	removeChangeListener: function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	},
	getStepmaster: function(){
		return stepmaster;
	},
	getFilteredLength: function(){
		return filteredIndexes.length;
	},
	getObjectAt: function(index){
		var filteredIndex = filteredIndexes[index];
		return stepmaster[ filteredIndex ];
	},
	getFilters: function(){
		return filters;
	},
	getName: function(key){
		return names[key];
	},
	getDimensions:function(){
		return dimensions;
	}
});

function handleAction(action){
	switch (action.type) {
		case 'set_stepmaster': 
			setStepmaster(action.stepArray);
			emitChange();
			break;
		case 'set_filter':
			setFilter(action.filtertype, action.value);
			emitChange();
			break;
		case 'set_height':
			setHeight(action.height);
			emitChange();
			break;
			
		default: // .. do nothing
	}
}

StepmasterStore.dispatchToken = AppDispatcher.register(handleAction);
module.exports = StepmasterStore;