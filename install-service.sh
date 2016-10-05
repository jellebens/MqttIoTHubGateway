#!/bin/bash
cp mqttiothubgateway.service /etc/systemd/system/mqttiothubgateway.service 

chmod 755 /etc/systemd/system/mqttiothubgateway.service

LOG_DIR=/var/log/MqttIoTHubGateway

if [ ! -d "$LOG_DIR" ]; then
	mkdir $LOG_DIR
	
fi

chown -Rv gateway:gateway $LOG_DIR

systemctl enable mqttiothubgateway.service


sudo systemctl restart mqttiothubgateway
