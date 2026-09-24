import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCarts1790229826562 implements MigrationInterface {
    name = 'AddCarts1790229826562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`carts\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_2ec1c94a977b940d85a4f498ae\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_items\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`cart_id\` varchar(36) NOT NULL, \`product_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_2ec1c94a977b940d85a4f498aea\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_6385a745d9e12a89b859bb25623\` FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_items\` ADD CONSTRAINT \`FK_30e89257a105eab7648a35c7fce\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_30e89257a105eab7648a35c7fce\``);
        await queryRunner.query(`ALTER TABLE \`cart_items\` DROP FOREIGN KEY \`FK_6385a745d9e12a89b859bb25623\``);
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_2ec1c94a977b940d85a4f498aea\``);
        await queryRunner.query(`DROP TABLE \`cart_items\``);
        await queryRunner.query(`DROP INDEX \`REL_2ec1c94a977b940d85a4f498ae\` ON \`carts\``);
        await queryRunner.query(`DROP TABLE \`carts\``);
    }

}
