# Recipe API

A modern Node.js Express API for managing recipes with MongoDB Atlas integration.

## 🚀 Features

- **Node.js 22 LTS** with latest Mongoose 8.x
- **MongoDB Atlas** integration
- **JWT Authentication** 
- **Swagger UI** documentation (development only)
- **Docker** containerization for dev and production
- **Express.js** with modern middleware

## 📋 API Documentation

### Swagger UI
- **Development**: Available at `/api-docs/` when `NODE_ENV=development`
- **Production**: Disabled for security
- **Authorization**: Use `Bearer <token>` format in the Authorization header
- **Example**: `http://localhost:3001/api-docs/`

## 🛠 Requirements

- **Node.js**: 22.x LTS
- **Docker**: For containerized development
- **MongoDB Atlas**: Cloud database connection

---

## 🐳 Docker Development (Recommended)

### Quick Start with Docker Compose

#### Development (with hot reload and Swagger)
```bash
# Start development environment
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

#### Production Testing (optimized, no Swagger)
```bash
# Start production container locally
docker-compose -f docker-compose.prod.yml up

# Build and start
docker-compose -f docker-compose.prod.yml up --build

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Manual Docker Commands

#### Build Images
```bash
# Development image (with dev tools)
docker build -f Dockerfile.dev -t recipe-api:dev .

# Production image (optimized)
docker build -f Dockerfile.prod -t recipe-api:prod .
```

#### Run Containers
```bash
# Development (with file watching)
docker run --env-file .env -p 3001:3001 \
  -v $(pwd):/usr/src/app \
  -v /usr/src/app/node_modules \
  recipe-api:dev

# Production (static)
docker run --env-file .env -p 3001:3001 recipe-api:prod
```

### Access Points
- **API**: [http://localhost:3001](http://localhost:3001)
- **Swagger UI** (dev only): [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **Health Check**: [http://localhost:3001/api/categories](http://localhost:3001/api/categories)

---

## 💻 Local Development (Non-Docker)

### Prerequisites
```bash
# Install Node.js 22 LTS
node --version  # Should be 22.x

# Install dependencies
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure your MongoDB Atlas connection:
```bash
DB_USER=your_atlas_username
DB_PASSWORD=your_atlas_password
DB_NAME=your_database_name
NODE_ENV=development
```

### Run Locally
```bash
# Development (with nodemon)
npm run dev

# Production mode
npm start
```

---

## 🌍 Environment Variables

### Required Variables
```bash
NODE_ENV=development          # or 'production'
PORT=3001                    # Server port
DB_USER=your_atlas_user      # MongoDB Atlas username
DB_PASSWORD=your_password    # MongoDB Atlas password  
DB_NAME=your_database        # Database name
JWT_SECRET=your_jwt_secret   # JWT signing secret
```

### Optional Variables
```bash
SERVER_URL=http://localhost:3001  # For Swagger docs
LOG_LEVEL=info                    # Logging level
```

---

## 📦 Container Differences

### Development Container
- ✅ **Nodemon** hot reload
- ✅ **Volume mounting** for live code changes
- ✅ **All dependencies** (including dev tools)
- ✅ **Swagger UI** enabled
- ✅ **Debug-friendly** setup

### Production Container  
- ✅ **Optimized build** (multi-stage)
- ✅ **Security hardened** (non-root user)
- ✅ **Production dependencies** only
- ✅ **No Swagger UI** (security)
- ✅ **Resource limits** and health checks
- ✅ **Smaller image size** (~150MB vs ~500MB)

---

## 🔧 Docker Management Commands

### Container Operations
```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# View container logs
docker logs <container_id>
docker logs -f <container_id>  # Follow logs

# Execute shell in running container
docker exec -it <container_id> /bin/sh
```

### Image Operations
```bash
# List images
docker images

# Remove an image
docker rmi <image_id>

# Remove unused images
docker image prune
```

### Docker Compose Operations
```bash
# View running services
docker-compose ps

# View logs for all services
docker-compose logs

# Follow logs for specific service
docker-compose logs -f recipe-api

# Rebuild and restart
docker-compose up --build

# Remove everything (containers, networks, volumes)
docker-compose down -v
```

### Cleanup Commands
```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused (be careful!)
docker system prune -a
```

---

## 🚀 Deployment Options

### Azure App Service (Traditional)
- Set Node.js version to **22 LTS** in Azure Portal
- Configure environment variables in **Configuration → Application Settings**
- Deploy via Git, ZIP, or CI/CD pipeline
- Your existing Azure setup will work with upgraded dependencies

### Azure Container Deployment
- **Azure Container Instances** (ACI)
- **Azure App Service** (container mode)
- **Azure Container Apps** (modern serverless containers)
- Use production Docker image with environment variables

### Production Environment Variables in Azure
```bash
NODE_ENV=production
DB_USER=your_atlas_username
DB_PASSWORD=your_atlas_password
DB_NAME=your_database_name
JWT_SECRET=your_secure_production_secret
```

---

## 📚 API Endpoints

### Public Endpoints
- `GET /api/categories` - List recipe categories

### Protected Endpoints (require JWT)
- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Create recipe
- `GET /api/users` - User operations
- `POST /api/favorites` - Manage favorites

### Documentation
- **Development**: `GET /api-docs` - Interactive Swagger UI
- **Production**: API documentation disabled for security

---

## 🛡 Security Features

### Production Container Security
- ✅ **Non-root user** execution
- ✅ **Read-only filesystem**
- ✅ **No new privileges**
- ✅ **Resource limits**
- ✅ **Health checks**
- ✅ **Minimal attack surface**

### API Security
- ✅ **JWT Authentication**
- ✅ **CORS configuration**
- ✅ **Input validation**
- ✅ **Production Swagger disabled**

---

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Docker Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### Environment Variables Not Loading
- Ensure `.env` file exists and has correct permissions
- Check file is not in `.gitignore`
- Verify variable names match exactly

#### Atlas Connection Issues
- Verify MongoDB Atlas whitelist includes your IP
- Check connection string format
- Ensure database user has proper permissions

---

## 📈 Performance Notes

### Mongoose 8.x Benefits
- ⚡ **20-30% faster** connections
- 🔄 **Better connection pooling**
- 📡 **Improved Atlas integration**
- 🛡️ **Enhanced security**

### Node.js 22 LTS Benefits
- ⚡ **Performance improvements**
- 🔒 **Security updates**
- 🆕 **Modern JavaScript features**
- 📦 **Better package management**


