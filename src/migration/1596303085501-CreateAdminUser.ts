import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { User } from "../entity/User";

export class CreateAdminUser1596303085501 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let user = new User();

        user.firstName = "admin";
        user.lastName = "admin";
        user.password = "admin";
        user.cpf = "11653512779";
        user.hashPassword();
        user.aleatorySusCardNumber();
        user.role = "ADMIN";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
