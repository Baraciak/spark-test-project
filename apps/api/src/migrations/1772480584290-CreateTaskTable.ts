import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskTable1772480584290 implements MigrationInterface {
    name = 'CreateTaskTable1772480584290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` uuid NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`order\` int NOT NULL DEFAULT '0', \`columnId\` uuid NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_0ecfe75e5bd731e00e634d70e5f\` FOREIGN KEY (\`columnId\`) REFERENCES \`board_columns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_0ecfe75e5bd731e00e634d70e5f\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }

}
