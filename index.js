#!/usr/bin/env node

var async = require('async'),
    noodle = require('noodlejs'),
    program = require('commander'),
    utils = require('./lib/utils.js'),
    query = require('./lib/query/'),
    AppInfo = require('./lib/model/'),
    appStore = require('./lib/appStore/');

var appVersion = require('./package.json').version;

program
    .version(appVersion)
    .usage('[options] <filename 1> <filename2> ...')
    .option('-u, --urls','Specify path to file with urls of websites')
    .parse(process.argv);

var listApps = [];
if(program.urls){
    var listWebsites = [];
    process.argv.forEach(function(item, index){
	if(index >= 3) {
	    try{
		if(utils.endsWith(item, '.txt')){
		    utils.loadFromTxt(listWebsites, utils.getRelativePath(item));
		}
		else if (utils.endsWith(item, '.json')){
		    utils.loadFromJson(listWebsites, utils.getRelativePath(item));
		}
	    }
	    catch(err){
		console.log( "Could not open file "+item+" with error "+err );
	    }
	}
    });

    listWebsites.forEach(function(website){
	listApps.push(new AppInfo(website));
    });
}

console.log( listApps[0] );

listApps.forEach(function(app){
    utils.getWebsiteName(app.websiteUrl, function(name){
	app.setWebsiteName(name);
	console.log( app.websiteName );
	try{
	    appStore.findApp(app.websiteName, function(res){
		var results = JSON.parse(res).results;
		console.log( results[0] );
	    });
	}catch(err){
	    console.log( "Failed to find app because "+err );
	}
    });
});


noodle.stopCache();
