import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBoardColumns1772478502575 implements MigrationInterface {
    name = 'CreateBoardColumns1772478502575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`board_columns\` (\`id\` uuid NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`order\` int NOT NULL DEFAULT '0', \`boardId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`board_columns\` ADD CONSTRAINT \`FK_9e515afed89e82e566e83caca37\` FOREIGN KEY (\`boardId\`) REFERENCES \`boards\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`board_columns\` DROP FOREIGN KEY \`FK_9e515afed89e82e566e83caca37\``);
        await queryRunner.query(`DROP TABLE \`board_columns\``);
    }

}
