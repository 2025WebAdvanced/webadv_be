#!/bin/bash

cd ~/webadv_be
git checkout main
git pull origin main
npm install
sudo systemctl restart api
