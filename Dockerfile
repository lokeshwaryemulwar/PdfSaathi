FROM node:18-slim

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install Node dependencies
RUN cd server && npm install
RUN cd client && npm install

# Copy Python requirements and install
COPY server/requirements.txt ./server/
RUN pip3 install -r server/requirements.txt --break-system-packages

# Copy source code
COPY . .

# Build Client
RUN cd client && npm run build

# Environment setup
ENV PORT=3000
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server/index.js"]
