# Menggunakan image Node.js 18 berbasis Alpine
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json ke container
COPY package*.json ./

# Install dependencies aplikasi
RUN npm install --production

# Menyalin semua file aplikasi ke container
COPY . .

# Menjalankan build Next.js
# RUN npm build

# Menentukan port yang akan digunakan oleh aplikasi (Cloud Run default adalah 8080)
EXPOSE 8080

# Perintah untuk menjalankan aplikasi setelah build
CMD ["npm", "start"]
