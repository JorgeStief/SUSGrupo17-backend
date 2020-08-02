import {Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
@Entity()
@Unique(["cpf"])
@Unique(["susCardNumber"])

export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    @Length(4, 20)
    @IsNotEmpty()
    firstName: string;

    @Column()
    @Length(4, 20)
    @IsNotEmpty()
    lastName: string;

    @Column()
    @IsNotEmpty()
    cpf: string;

    @Column()
    susCardNumber: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column({ nullable: true})
    birthday: string;

    @Column({ nullable: true})
    cep: string

    @Column({ nullable: true})
    address: string

    @Column({ nullable: true})
    neighborhood: string

    @Column({ nullable: true})
    city: string

    @Column({ nullable: true})
    state: string

    @Column()
    @IsNotEmpty()
    role: string;


    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    
    aleatorySusCardNumber(){
        var susCardNumber = Math.floor(Math.random() * (10)).toString()
        for (var i = 0; i<14; i++){
            susCardNumber = susCardNumber + Math.floor(Math.random() * (10)).toString();
        }
        this.susCardNumber = susCardNumber
    }
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }  

}
