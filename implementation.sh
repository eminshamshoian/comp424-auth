#!/bin/bash
  
# Set connections per minute to 30 after first 100 to prevent DDOS
sudo iptables -A INPUT -p tcp --dport 80 -m limit --limit 30/minute --limit-burst 100 -j ACCEPT

# Allow loopback access so that server can bing itself using localhost or etc
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# Allow pings to be made to the server from inside the system
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
sudo iptables -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT
