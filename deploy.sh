#!/bin/bash

# Variables
SERVER="root@159.203.188.95"
PROJECT_DIR="deusgpt-chat"
ARCHIVE_NAME="deusgpt-chat.tar.gz"

# Install dependencies locally
echo "Installing dependencies locally..."
npm install

# Build the project
echo "Building the project..."
npm run build

rsync -avz --delete ./.next $SERVER:$PROJECT_DIR/

# SSH into the server and handle deployment
ssh $SERVER << EOF

# Change directory
cd $PROJECT_DIR

# Start the project (you may want to use a process manager like PM2)
sudo systemctl restart deusgpt-chat.service

EOF

# Clean up local archive
echo "Cleaning up local archive..."
rm -f $ARCHIVE_NAME


echo "Deployment completed successfully!"