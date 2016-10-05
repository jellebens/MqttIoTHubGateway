#!/bin/bash
cp mqttiothubgateway.service /etc/systemd/system/mqttiothubgateway.service 

chmod 755 /etc/systemd/system/mqttiothubgateway.service

systemctl enable mqttiothubgateway.service




