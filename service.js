'use strict';

var mqtt = require('mqtt');
var winston = require('winston');
var moment = require('moment');
var config = require('./config.js');
var MqttDevice = require('azure-iot-device-mqtt');
var IotDevice = require('azure-iot-device');
var clientId='MqttIoTHubgateWay'; 


var logfile = '/var/log/MqttIotHubGateway/errlog_' + moment().format('YYMMDDhhmmss')  + '.log';

var logger = new (winston.Logger)({
                                transports : [  new winston.transports.File({
                                                        level: 'error',
                                                        filename:  logfile,
                                                        handleExceptions: true,
                                                        json: false,
                                                        maxsize: 5242880, //5MB
                                                        maxFiles: 5,
                                                        colorize: false}),
                                                new (winston.transports.Console)({
                                                        'timestamp': true,
                                                        colorize: true,
                                                        prettyPrint:true,
                                                        handleExceptions:true
                                                        })
                                            ]});




var connectionString = config.iotHub.Connectionstring;
logger.info('Creating Azure IotHub Client');
var azureClient = MqttDevice.clientFromConnectionString(connectionString);

logger.info('Connecting Azure IotHub Client');
azureClient.open(function(err){
	if(err){
		logger.error('Error occurred when connecting to Azure IoTHub' + err);
	}else{
		logger.info('Client successfully connected to Azure IoTHub.');
	}
});


logger.info('Creating Subscriber for local bus');

var mqttClientSettings= {
        clean:false,
        clientId: clientId,
        will: {topic: 'bir57/sytem/' + clientId + '/status', payload: 'offline (uexpected)', retain:true, qos:1}
}


var mqttClient = mqtt.connect('mqtt://localhost', mqttClientSettings);

logger.info('Subscribing to topics');
mqttClient.subscribe('bir57/#');

logger.info('Starting to listen to messages');
mqttClient.on('message', function(topic, msg){
	
	logger.info('Received message on topic ' + topic);

        var forwardedMsg = new IotDevice.Message('');
        
        azureClient.sendEvent(forwardedMsg, printResultFor('send'));
        
});


function printResultFor(op) {
   
    return function printResult(err, res) {
        if (err) { 
	    logger.error(op + ' error: ' + err.toString());
	    logger.info('Exiting');
	    process.exit(1);
	} 
        if (res) { 
            logger.info('Message successfully forwarded');
        } 
    };
} 
