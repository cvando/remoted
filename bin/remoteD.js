var fun = require('./functions');
var conql = require('./sql')
var fs = require('fs');
var spawn = require('child_process').spawn;
var WebSocketServer = require("ws").Server;
var WebSocketClient = require("ws").client;
var ws = new WebSocketServer( { port: 8080 } );
var loop;
var down_state = 1;

console.log((new Date()) + '  Listen  8080');

	conql.reqall(function(error, json) {
		if (json!==null){
		  for (var i = 0; i < json.length; i++) {
			if(json[i].TIME != "Done" && json[i].TIME !== null){
				conql.remove(json[i].pid)
				fun.wget(json[i].URL);
			}
		  }
		}
	});

ws.on('connection', function connection(ws){
  
  console.log((new Date()) + "  new connection");

	/////////////LISTEN//////////////////
	ws.onmessage = function (evt){
		try {
		objmess = JSON.parse(evt.data);
		} catch(err) {
			send((new Date()) + " not a valid json");
			}
		switch (objmess.event){

				case "wget":
					fun.wget(objmess.data)
					send("create", objmess.data)
				break;
				
				case "getdata":
					clearInterval(loop);
					conql.reqall(function(error, json) {
						send("push", json)
					});
				break;
				
				case "getfile":
					clearInterval(loop);
					fun.readf(function(file) {
						send("file", file);
					});
					
					fun.readlease(function(file) {
									send("lease", file);
								});
					
					loop = setInterval(function() {
								fun.readlease(function(file) {
									send("lease", file);
								});
					}, 5000);
				break;
			
				case "getrsync":
					clearInterval(loop);
					fun.readrsync(function(file) {
						send("rsync", file);
					});
				
				break;
				
				case "getsystem":
					clearInterval(loop);
					loop = setInterval(function() {
								  fun.system(function(data) {
						        send("system", data);
						      });
					}, 5000);
								
					fun.system(function(data) {
						send("system", data);
					});
					
				break;
				
				case "gmusic":
					clearInterval(loop);
					fun.gmusic(objmess.data);
					
				break;
				
				case "vnc":
					clearInterval(loop);
					fun.vnc(objmess.data);
					
				break;
				
				case "iftop":
					clearInterval(loop);
					loop = setInterval(function() {
									fun.iftop(function(data) {
									  send("iftop", data);
									});
					}, 5000);
				break;
			
				
				case "remove":
					conql.remove(objmess.data.pid)
					fun.remove(objmess.data.NAME,objmess.data.pid)
				break;

				case "alive":
					conql.reqall(function(error, json) {
						send("downloading", json)						
					});
				break;
				
				case "pause":
				  pause()
				break;
				
				case "resume":
				  resume()
				break;
        
				case "chromext":
					send("ack", objmess.data);
				break;

				default:
					send("unknown", null);
				break;
		}
	};
  
  ///////////pause/resume/////////////
  function pause(){
    conql.reqall(function(error, json) {
      for (var i = 0; i < json.length; i++) {
        if(json[i].TIME != "Done" && json[i].TIME !== null){
          fun.pause(json[i].pid);
        }
      }
  	});
  }
  function resume(){
    conql.reqall(function(error, json) {
      for (var i = 0; i < json.length; i++) {
        if(json[i].TIME != "Done" && json[i].TIME !== null){
          fun.resume(json[i].pid);
        }
      }
  	});
  }
  
	///////messages/////////////////////
	function send (methode, answer){
		if (ws.readyState != ws.OPEN) {
			console.error('Client state is ' + ws.readyState);
		}
		else {
			ws.send(
				JSON.stringify(
					{"event": methode,
					"data": answer}
				)
			);
		}
	}
	
	
	//////////on close////
	ws.on('close', function() {
    console.log(' disconnected');
		clearInterval(loop);
    });
	
	
});