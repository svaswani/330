/**Node implements commonJS for imports and exports.
   Node is configured to look for an installed package in node_modules when only a name is given. 
   That is, when no file path is given, node will look for installed modules with the name given
   When a file path is given, node will look for a JS file to load in.
   
   Note that node only imports modules once, so imports are not recursive. Importing a module that imports the first module will not
   cause a recursive problem. Each one will only be imported once. Importing the same modules in multiple classes has the performance
   as importing the module in only one class.
   
   Most modules/files will return an API to be put into a variable. Others will add directly into scope. 
   You just have to know the API of what you are importing. 
   Often you can find this online at https://www.npmjs.org/ or at the project's repository (usually Github or Bitbucket) 
   Your code may also return a variable (holding all of the scope of the other class/module) or add directly into scope.
   Usually you will just return a variable. If you add directly to scope be very cautious because that can be costly. 
   Essentially, adding directly to scope means manipulating the globals for this class. Some modules do this because they
   need full scope access, are global singletons or are extension modules that manipulate a module already imported into scope.
   
   Note, you can also make code that extends off of another module add or manipulating functionality of that module. 
**/
var http = require('http'); //the http module will be stored as the variable http
var _ = require('underscore'); //The underscore module will be stored as the variable "_"
var myData = require('./myData.js'); //The myData.js class will be stored as the variable myData
var Polygon = require('./Polygon.js'); //The Polygon class will be stored as the variable Polygon

/**Function to handle requests/responses. When node makes an http (as opposed to udp, tcp, etc) server call, it passes
    the request object and a response object. The request object holds all of the variables about the request, session, etc.
    The response object is an object containing all of the response data such as ip/port, hostname, flags, body, response code, etc.
    The response object also contains all of the methods of the response. 
    You are free to then manipulate the response object before sending it back. 
**/
var port = process.env.PORT || process.env.NODE_PORT || 3000;

function onRequest(request, response) {
  //example to show favicon request (automatic from browsers)
  if (request.url === '/favicon.ico') {
    console.log('favicon request');
  } 
    
  //use the response's write head function to add a status code and a JSON object of all the headers.
  //This is where you can set the content type, content length, location, etc.
  //Optionally the second argument can be an error message like "Access forbidden" and the third argument can be the JSON headers
  response.writeHead(200, {"Content-Type": "text/plain"});
  
  //fires twice because of favicon request from the browser
  //Chrome sends a request for the data and a separate request for the little icon shown on the page tab
  console.log('request received');
  
  //the response's write method writes chunks of data to the body. The optional second argument is encoding type. Default is UTF-8
  response.write(myData.getMessage());
  
  //the response's end method sends the response back to the client. Otherwise the response never gets sent. 
  //Code can run after this, but nothing can be sent back to the client after this because HTTP is limited to one response per request
  response.end();
}

//call the http module's create server function with a request callback and tell it to listen on port 8000. 
//Normally this would be port 80, 443 or 8080, but in this example we use 8000 to prevent conflicting with local machine traffic
http.createServer(onRequest).listen(port);

//Example of a module pulled into scope
//create an array
var myArray = [1, 2, 3, 4, 5];
//use the underscore module's contains function to find out if the number 3 is in the array given
var found = _.contains(myArray, 3);
console.log(found);

//pulling in the myData class and testing its exports
//print out the message and getMessage function from the class
//message will be undefined because it was not exported, thus it does not have public scope
//getMessage() will print because it was exported and it does have public scope
console.log(myData.message);
console.log(myData.getMessage());

//Create a new polygon from our imported Polygon class
var myPolygon = new Polygon(10,15); //parameters are height/width
//print out height attribute from our polygon object. We know this because it's defined in our other file.
console.log(myPolygon.height); 