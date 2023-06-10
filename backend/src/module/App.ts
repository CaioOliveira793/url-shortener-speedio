import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { createGlobalConfigOptions } from "@/config/ConfigOptions";
import { IamModule } from '@/module/iam/IamModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		IamModule
	],
})
export class AppModule {}
