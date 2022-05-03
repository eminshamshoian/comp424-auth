#!/usr/bin/env bash
# Setup NODEJS and NPM Pachakge Installer
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 To Run Server And React Application
sudo npm install -g pm2
sudo pm2 startup systemd

# Install NGINX To Serve Our Frontend
sudo apt-get install -y nginx

# Install UFW Firewall And Allow Connections
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable