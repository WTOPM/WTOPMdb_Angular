# Используем официальный образ Node.js
FROM node:18 AS development

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Устанавливаем Angular CLI глобально
RUN npm install -g @angular/cli

# Копируем весь исходный код
COPY . .

# Открываем порт для ng serve
EXPOSE 4200

# Команда для запуска в режиме разработки
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]