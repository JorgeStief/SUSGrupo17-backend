import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { cpfOrSusCardNumber, password } = req.body;
    let aux;
    if (!(cpfOrSusCardNumber && password)) {
      res.status(400).send();
    }

    if (cpfOrSusCardNumber.length === 15 ){
      const susCardNumber = cpfOrSusCardNumber
      aux = { susCardNumber }
    }
    else{
      const cpf = cpfOrSusCardNumber
      aux = { cpf }
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: aux  });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.cpf },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send({token});
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };

  static verifyToken = async (req:Request, res:Response) => {
    
    try {
      const token = <string>req.headers["auth"]
      let { exp } = <any>jwt.decode(token)
      
      if (Date.now() >= exp ) {
        console.log(exp)
        res.status(200).send({response: false, message:"Sua sessão expirou!"});
      }
    } catch (err) {
      res.status(401).send({response: false, message:"Erro ao verificar o Token!"});;;
    }
    res.status(200).send({response: true});
  }
}


export default AuthController;