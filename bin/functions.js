var exec = require('child_process').exec;
var midldir= "/etc/remoted/bin";
var logs= "/etc/remoted/logs";

	exports.wget = function (alink){
		var cmd = "bash "+midldir+'/wget.sh \" '+ alink +'\" 0<&- &>>'+logs+'/logs.log &'
		exec(cmd, function(error, stdout, stderr) {
			console.log(error + stdout + stderr);
		});
	}

	exports.pause = function (pid){
		var cmd = "kill -STOP "+pid
		exec(cmd, function(error, stdout, stderr) {
			console.log(error + stdout + stderr);
		});
	}

	exports.resume = function (pid){
		var cmd = "kill -CONT "+pid
		exec(cmd, function(error, stdout, stderr) {
			console.log(error + stdout + stderr);
		});
	}

	exports.remove = function (name,pid){
		var cmd ='rm \"/data/'+name+'\"';
		exec(cmd, function(error, stdout, stderr) {
		});
		var cmd1 ='kill '+pid;
		exec(cmd1, function(error, stdout, stderr) {
		});
	}
