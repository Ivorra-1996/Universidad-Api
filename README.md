## proyecto_api
### _Proyecto de generar una api_


## 😏 Como levantar una api paso a paso 😏

### 1) clonar el código del repositorio:
    
    https://github.com/Ivorra-1996/proyecto_api.git

### 2) Entrar al directorio Api 📁:
Posicionate en tu directorio de Api.
Ejemplo:
     
     C:\Users\jose_\Desktop> cd Api\proyecto_api
    
#### 3) Realizar la instalación de sus dependencias >_:
Instalar las dependencias necesarias, por linea de comando
     
     > npm install 
     > npm update

### 4) Realizar la instalación de sequelize-cli >_:

     > npm install sequelize-cli --save
     
### 5) Ejecutar las migraciones >_:
Estas son las creaciones de entidades y migraciones a la base de datos.
     
     C:\Users\jose_\Desktop\Api\proyecto_api> npx sequelize-cli model:generate --name loggin --attributes usuario:string,password:string
     C:\Users\jose_\Desktop\Api\proyecto_api> npx sequelize db:migrate

### 6) Levantar la api >_:

     C:\Users\jose_\Desktop\Api\proyecto_api> npm start


### MER:

![MER de las entidades](https://raw.githubusercontent.com/Ivorra-1996/proyecto_api/main/mer.PNG)
