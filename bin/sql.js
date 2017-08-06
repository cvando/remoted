var mysql = require('mysql');
var rj;
var mySqlClient = mysql.createConnection({
  host     : "mysql",
  user     : "user",
  password : "pass",
  database : "download"
});

/////////////////select////////////////////////
exports.reqall = function(callback) { 
	mySqlClient.query("SELECT * FROM ENCOURS order by id DESC",function select(error, results) {
		if (error) {
		  console.log(error);
		  mySqlClient.end();
		  callback(error, null);
		  return;
		}
		if ( results.length > 0 ){ 
			if (typeof callback === "function") {
				callback(null,results);
			}	
		} else{
			if (typeof callback === "function") {
				callback(null,null);
			}	
		}	
	  }
	);
};

exports.progress = function(callback) { 
	mySqlClient.query("SELECT TIME FROM ENCOURS order by id DESC",function select(error, results) {
		if (error) {
			console.log(error);
			mySqlClient.end();
			callback(error, null);
			return;
		}

		if ( results.length > 0 ){ 
			if (typeof callback === "function") {
				callback(null,results);
			}
		} 	
	});
};

exports.remove = function(pid) { 
	mySqlClient.query("DELETE FROM ENCOURS WHERE pid="+ pid,function select(error, results) {
		if (error) {
			console.log(error);
			
			mySqlClient.end();
			return;
		}
		console.log(results)
	});
};

