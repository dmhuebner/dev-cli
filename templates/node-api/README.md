# {%projectTitle%}
{%projectDescription%}

##### Local Development

You will need an SSL cert and key in the https directory to run the https server. 

You can generate a self-signed SSL cert with openssl for development.

Add 'https' directory in root of project if there is not one already

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout https/key.pem -out https/cert.pem
```
