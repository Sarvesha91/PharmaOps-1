import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1763637639603 implements MigrationInterface {
    name = 'InitSchema1763637639603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "domain" character varying, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyName" character varying NOT NULL, "licenseNumber" character varying, "warehouseAddress" character varying, "userId" uuid, CONSTRAINT "REL_658558b7f3a6163382505c8009" UNIQUE ("userId"), CONSTRAINT "PK_bcb47b1a47f4f1447447eaf73a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying, "role" character varying NOT NULL DEFAULT 'VENDOR', "companyId" uuid, "vendorProfileId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_faa332287afb8bec89e3ed58bf" UNIQUE ("vendorProfileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "docType" character varying, "country" character varying, "product" character varying, "storageTag" character varying, "version" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "region" character varying, "owner" character varying, "expiryDate" date, "effectiveDate" character varying, "s3Url" character varying, "fileHash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uploadedBy" uuid, "approvedBy" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product" character varying NOT NULL, "lotNumber" character varying NOT NULL, "quantity" integer NOT NULL, "origin" character varying NOT NULL, "destination" character varying NOT NULL, "status" character varying NOT NULL, "eta" date NOT NULL, "telemetry" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6deda4532ac542a93eab214b564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "sku" character varying, "companyId" uuid, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendor_product_assignments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isMasterLicenseValid" boolean NOT NULL DEFAULT false, "vendorUserId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "PK_d41b0363781d5f509b1938fb681" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document_requirements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "requiredForExport" boolean NOT NULL DEFAULT false, "productId" uuid NOT NULL, CONSTRAINT "PK_21b28e7d53255a15274f676f4c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_document_statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying(16) NOT NULL DEFAULT 'MISSING', "notes" character varying, "orderId" uuid NOT NULL, "documentId" uuid, CONSTRAINT "PK_b3442b862745388e5cf81094acf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying(32) NOT NULL DEFAULT 'DRAFT', "companyId" uuid NOT NULL, "createdBy" uuid NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blockchain_anchors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "txHash" character varying NOT NULL, "network" character varying NOT NULL, "anchoredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "documentId" uuid NOT NULL, CONSTRAINT "PK_6ca0862db7daf72c7a22ab3ae03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_trail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "details" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "performedBy" uuid, CONSTRAINT "PK_91aade8e45ada93f7dc98ca7ced" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD CONSTRAINT "FK_658558b7f3a6163382505c8009e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6f9395c9037632a31107c8a9e58" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_faa332287afb8bec89e3ed58bf6" FOREIGN KEY ("vendorProfileId") REFERENCES "vendor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_236dfbbac76eceda26294a645de" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_da65bee4b0e9c759aa09cb8629e" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_47942e65af8e4235d4045515f05" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_product_assignments" ADD CONSTRAINT "FK_fc8e43d6bed3fd9a61fab5affc2" FOREIGN KEY ("vendorUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_product_assignments" ADD CONSTRAINT "FK_a0658a759885a89787a3a716b5a" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document_requirements" ADD CONSTRAINT "FK_6332e36c2212bf473614d37f5d2" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_document_statuses" ADD CONSTRAINT "FK_f5539489b53664fb624fcfad80b" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_document_statuses" ADD CONSTRAINT "FK_a38a514c5cc5d4e172320fca6f4" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_b6fe899d5ca4a3f5925463990d1" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_8d17fd47a7bbf512e58209fbb38" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blockchain_anchors" ADD CONSTRAINT "FK_b87b3ee6df50d43e74a6cea6963" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_trail" ADD CONSTRAINT "FK_8f8f3b059a05dd0739b169f5814" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_trail" DROP CONSTRAINT "FK_8f8f3b059a05dd0739b169f5814"`);
        await queryRunner.query(`ALTER TABLE "blockchain_anchors" DROP CONSTRAINT "FK_b87b3ee6df50d43e74a6cea6963"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_8d17fd47a7bbf512e58209fbb38"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_b6fe899d5ca4a3f5925463990d1"`);
        await queryRunner.query(`ALTER TABLE "order_document_statuses" DROP CONSTRAINT "FK_a38a514c5cc5d4e172320fca6f4"`);
        await queryRunner.query(`ALTER TABLE "order_document_statuses" DROP CONSTRAINT "FK_f5539489b53664fb624fcfad80b"`);
        await queryRunner.query(`ALTER TABLE "document_requirements" DROP CONSTRAINT "FK_6332e36c2212bf473614d37f5d2"`);
        await queryRunner.query(`ALTER TABLE "vendor_product_assignments" DROP CONSTRAINT "FK_a0658a759885a89787a3a716b5a"`);
        await queryRunner.query(`ALTER TABLE "vendor_product_assignments" DROP CONSTRAINT "FK_fc8e43d6bed3fd9a61fab5affc2"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_47942e65af8e4235d4045515f05"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_da65bee4b0e9c759aa09cb8629e"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_236dfbbac76eceda26294a645de"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_faa332287afb8bec89e3ed58bf6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6f9395c9037632a31107c8a9e58"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP CONSTRAINT "FK_658558b7f3a6163382505c8009e"`);
        await queryRunner.query(`DROP TABLE "audit_trail"`);
        await queryRunner.query(`DROP TABLE "blockchain_anchors"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_document_statuses"`);
        await queryRunner.query(`DROP TABLE "document_requirements"`);
        await queryRunner.query(`DROP TABLE "vendor_product_assignments"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "shipments"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "vendor_profiles"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
