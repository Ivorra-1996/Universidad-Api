const models = require('../models');
//const {loggin} = require('../models/index'); // importa todos los modelos de DB que se encuentran dentro del archivo DB
const bcrypt = require('bcrypt'); // importamos para poder encriptar.
const jwt = require('jsonwebtoken'); // importamos el json web token para ponerle un codigo a la api.
require('dotenv').config('../.env');
// const secret = process.env.SECRET;
// const expireIn = process.env.EXPIRESIN;
// Problemas con el secret y espireIN se instancian en undefined....
const secret = "BD";
const expireIn = "120s";

const getAllLoggins = async (req, res) => {
    models.loggin
      .findAll(
            {
                offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
                limit: parseInt(req.params.cantidad),
                attributes: ["id", "usuario","password"]
            }
        )
      .then(loggin => res.send(loggin))
      .catch(() => res.sendStatus(500));
};

const getOneLoggin = async (req,res) => {
    const id = req.params.id;
    try {
        models.loggin.findOne({
            attributes: ["id","usuario","password"],
            where: {id}
        }).then(loggin => ( loggin ? res.status(200).send(loggin) : res.status(404).send("NOT FOUND")));

    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};


const loggin = async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const loggin = await models.loggin.findOne(
            {
                attributes: ["id", "usuario", "password"],
                where: { usuario: usuario }
            }
        );
        
        if (!loggin) {
            return res.status(401).send("Usuario no encontrado");
        }

        const esValido = bcrypt.compareSync(password, loggin.password);
        if (esValido) {
            console.log("Secreto: ",secret);
            console.log("Expira: ", expireIn);
            const token = jwt.sign({ loggin: loggin }, secret, { expiresIn: expireIn });
            console.log(token);
            res.json(
                {
                    usuario: loggin,
                    token: token
                }
            );
        } else {
            res.status(401).send("Contraseña incorrecta");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
};

const singupLoggin = async (req,res) => {
    // Encriptamo password antes de pasarla.
    let password = bcrypt.hashSync(req.body.password,10);
    //Crear Usuario
    models.loggin.create(
        {
            usuario: req.body.usuario,
            password: password
        }
        ).then(loggin => { 
            // Generamos el token!!.
            let token = jwt.sign({usuario: loggin},secret,{expiresIn: expireIn});
                
            // Lo devolvemos como un objeto.
            res.json(
                {
                    usuario: loggin,
                    token:token
                }
            );
        }).catch(error => {
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).send('Nombre de usuario en uso');
        } else {
            console.error(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
    });    
};

const updatePassword = async (req,res) => {
    let password = bcrypt.hashSync(req.body.password,10);
    const id = req.params.id;
    const bodyLoggin = loggins =>
            loggins
                .update({ 
                        password: password,
                        },
                        { fields: ["id","usuario","password"] })
                .then(() => res.status(200).send("Password modificada!"))
                .catch(error => {
                        if (error == "SequelizeUniqueConstraintError: Validation error") {
                            res.status(400).send('Bad request')
                        }
                        else {
                            res.sendStatus(500).send(`Error al intentar actualizar la base de datos: ${error}`)
                        }
                    });
    models.loggin.findOne(
        {
            attributes: ["id","usuario","password"],
            where: {id}
        }
    ).then(loggin => (loggin ? bodyLoggin(loggin) : res.status(404).send("NOT FOUND")))
    .catch(() => res.status(500));
};

const deleteLoggin = async (req,res) => {
    let id = req.params.id;
    const destroy = loggin => 
            loggin.destroy()
            .then(() => res.status(200).send("Usuario eliminado"))
            .catch(() => res.sendStatus(500));
    models.loggin.findOne(
        {
            attributes: ["id","usuario","password"],
            where: {id}
        }
    ).then(loggin => (loggin ? destroy(loggin) : res.status(404).send("NOT FOUND")))
    .catch(() => res.status(500));
};

module.exports = {
    getAllLoggins,
    getOneLoggin,
    loggin,
    singupLoggin,
    updatePassword,
    deleteLoggin
};