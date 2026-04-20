# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 设置构建时的环境变量
ENV VITE_API_BASE=/api

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段 - 使用 Nginx 提供静态文件
FROM nginx:alpine

# 复制构建产物到 Nginx 的静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]