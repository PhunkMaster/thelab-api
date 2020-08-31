FROM node:12

# Get the image up to date, and install needed files
RUN apt update && \
    apt upgrade -y

# Copy needed files in to the image
COPY app /app

# Set the working directory
WORKDIR /app

# Make sure that npm packages are up to date
RUN npm install

# Cleanup the image
RUN apt clean autoclean && \
    apt autoremove -y && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT node app.js
