var mqtt = require('mqtt');
var winston = require('winston');
var moment = require('moment');
var config = require('./config.js');
var mqttDevice = require('azure-iot-device-mqtt');
var iotDevice = require('azure-iot-device');


var clientId='MqttIoTHubgateWay'; 

var mqttClientSettings= {
	clean:false,
	clientId: clientId,
	will: {topic: 'bir57/sytem/' + clientId + '/status', payload: 'offline (uexpected)', retain:true, qos:1}
}


var mqttClient = {}; //mqtt.connect('mqtt://localhost', mqttClientSettings);
//mqttClient.subscribe('bir57/#');

//Create Azure Device
var protocol = mqttDevice.Mqtt;
var azureClient = mqttDevice.clientFromConnectionString(config.iotHub.Connectionstring, protocol);
azureClient.open(connectCallback);


var connectCallback = function (err) {
    if (err) {
        logger.error('Could not connect: ' + err);
    } else {
        logger.info('Client connected to cloud');

    }
}




var logfile = '/var/log/MqttIotHubGateway/errlog_' + moment().format('YYMMDDhhmmss')  + '.log';

var logger = new (winston.Logger)({ 
				transports : [  new winston.transports.File({
            						level: 'error',
	            					filename:  logfile,
						        handleExceptions: true,
            						json: false,
            						maxsize: 5242880, //5MB
            						maxFiles: 5,
							handleExceptions: true,
            						colorize: false}),					
						new (winston.transports.Console)({
							'timestamp': true,
							colorize: true,
							handleExceptions: true
						})
					    ]});



//mqttClient.on('message', function(topic, msg){
//	
//	logger.info('Received message on topic ' + topic + ' ' + msg);
//
//        var forwardedMsg = new iotDevice.Message(msg);
        
//        azureClient.sendEvent(forwardedMsg, printResultFor('send'));
//        
//        logger.info('Message forwarded')
//});


function printResultFor(op) {
   
    return function printResult(err, res) {
        if (err) { 
	    logger.error(op + ' error: ' + err.toString());
	    logger.info('Exiting');
	    process.exit(1);
	} 
        if (res) { 
            logger.info(op + ' status: ' + res.constructor.name);
        } 
    };
} 
