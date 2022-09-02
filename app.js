console.log('No value for FOO yet:', process.env.Bearer);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('Now the value for Bearer is:', process.env.Bearer);

var fs         = require('fs'),
    util       = require('util'),
    //xml2js   = require('xml2js'),
    express    = require("express"),
    bodyParser = require("body-parser")
    request    = require('request');
    require('dotenv').config();
    ;
 
//var parser = new xml2js.Parser();
var app = express();
var port = 3000;
//var fileToParse = "./public/examples/digimeds_example1.xml";

// Serve Static Assets
app.use(express.static("public"));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

global.target = process.env.Target;

theUrl = process.env.Base_Url + '/FHIR/R4/Immunization?patient.identifier=https%3A%2F%2Ffhir.nhs.uk%2FId%2Fnhs-number%7C' + process.env.NHSNumber + '&immunization.target=' + global.target + '&_include=Immunization%3Apatient';

/* old code
theUrl = process.env.Base_Url + '/FHIR/R4/Immunization?patient.identifier=https%3A%2F%2Ffhir.nhs.uk%2FId%2Fnhs-number%7C' + process.env.NHSNumber + '&procedure-code%3Abelow=90640007' + '&date.from=1900-01-01&date.to=9999-12-31&_include=Immunization%3Apatient';
*/
console.log("theUrl= " + theUrl);

const options = {
  url: theUrl,
  headers: {
              'accept': 'application/fhir+json',
              'Authorization': 'Bearer ' + process.env.Bearer
  }
}

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {

    console.log("success");


    // https://stackoverflow.com/questions/11922383/how-can-i-access-and-process-nested-objects-arrays-or-json -
    const info = JSON.parse(body);

var numberOfResources = info.entry.length - 1;
//var numberOfResources = info.entry.length;
console.log("numberOfResources : " + numberOfResources);
//console.log("type : " + typeof numberOfResources);

global.immCounter = 0;
global.vaccineProcedureCode = [];
global.vaccineProcedureDisplay = [];
global.vaccineCodeSNOMED = []; 
global.vaccineCodeDisplay = []; 

for (i = 0; i <= numberOfResources; i++) {

    console.log("i : " + i);

   //console.log( info );
   // console.log("pointer fullUrl : " + info.entry[i].fullUrl);
    console.log("resource type: " + info.entry[i].resource.resourceType);
    var resource = info.entry[i].resource.resourceType;
    console.log( "this is the resource " + resource );

    if (resource == "Immunization")  {

      global.immCounter++;

      console.log("i is " + i );

      global.vaccineProcedureCode[i]    = info.entry[i].resource.extension[0].valueCodeableConcept.coding[0].code;   
      global.vaccineProcedureDisplay[i] = info.entry[i].resource.extension[0].valueCodeableConcept.coding[0].display;
      global.vaccineCodeSNOMED[i]       = info.entry[i].resource.vaccineCode.coding[0].code;
      global.vaccineCodeDisplay[i]      = info.entry[i].resource.vaccineCode.coding[0].display;

      console.log("Immcounter " + immCounter);

    }

    if (resource == "Patient")  {
            // Patient resource
      global.nhsnumber          = info.entry[i].resource.identifier[0].value;
      global.patDOB1            = info.entry[i].resource.birthDate;
      console.log("NHS Number: " + nhsnumber );
      console.log("DOB: " + patDOB1 );
    }

  }

   }
  else {
  console.log( "Things did not work :" + response)
  }
}

request(options, callback);

app.get("/",function(req,res){
  res.render("home");
});

app.listen(port, () => console.log("Server started and listening on port " + port ));