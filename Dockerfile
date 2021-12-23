FROM public.ecr.aws/lambda/nodejs:14

RUN yum update -y
RUN yum install xz atk cups-libs gtk3 libXcomposite alsa-lib tar \
    libXcursor libXdamage libXext libXi libXrandr libXScrnSaver \
    libXtst pango at-spi2-atk libXt xorg-x11-server-Xvfb \
    xorg-x11-xauth dbus-glib dbus-glib-devel unzip bzip2 -y -q

ADD app.js main.js package.json package-lock.json /var/task/

RUN npm ci

CMD [ "app.handler" ]