import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";
import {User} from "./entity/User";

createConnection().then(async connection => {

    // create express app
    const app = express();

     // Call midlewares
     app.use(cors());
     app.use(helmet());
     app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);
    // start express server
    app.listen(3333, () => {
        console.log("Server started on port 3333!")
    });

    // // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     age: 27
    // }));
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     age: 24
    // }));

}).catch(error => console.log(error));
