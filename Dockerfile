FROM node:18.13.0-alpine

RUN apk update
# RUN apk add --update alpine-sdk
# RUN apk add libffi-dev openssl-dev
# RUN apk --no-cache --update add build-base
# RUN apk add cmake
# RUN apk add libjpeg-turbo-dev
# RUN apk add libpng-dev
# RUN apk add libwebp-dev
# RUN apk add curl
# RUN apk add meson
# RUN apk add ninja
# RUN apk add python3
# RUN apk add python3-dev
# RUN apk add py3-pip
# RUN apk add --virtual build-dependencies
# RUN apk add gcc
# RUN apk add wget
# RUN apk add git
# RUN apk add xz
# RUN apk add glib-dev
# RUN apk add expat
# RUN apk add expat-dev
# RUN apk add --no-cache --virtual .build-deps
# RUN apk add autoconf
# RUN apk add automake
# RUN apk add gobject-introspection-dev
# RUN apk add gtk-doc
# RUN apk add libtool
# RUN apk add nasm
RUN apk add pkgconf 
RUN apk add vips

# RUN pip3 install --upgrade pip
# RUN pip3 install --upgrade setuptools
# RUN pip3 install --upgrade wheel

# RUN mkdir -p /tmp

# RUN curl -L https://github.com/strukturag/libheif/releases/download/v1.16.2/libheif-1.16.2.tar.gz -o /tmp/libheif.tar.gz
# RUN tar -xvf /tmp/libheif.tar.gz -C /tmp
# RUN mkdir /tmp/libheif-1.16.2/build
# WORKDIR /tmp/libheif-1.16.2/build
# RUN cmake --preset=release .. 
# RUN make 
# RUN make install



# WORKDIR /tmp
# RUN curl -L https://github.com/libvips/libvips/releases/download/v8.14.2/vips-8.14.2.tar.xz -o /tmp/vips.tar.xz
# RUN tar -xJvf /tmp/vips.tar.xz -C /tmp
# WORKDIR /tmp/vips-8.14.2
# RUN meson setup build --prefix /tmp/vips-8.14.2/build
# WORKDIR /tmp/vips-8.14.2/build
# RUN ninja
# RUN ninja install


ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI
ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
RUN rm -rf /node_modules/sharp
RUN npm install heic-convert
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linuxmusl --libc=glibc sharp

COPY . .
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
