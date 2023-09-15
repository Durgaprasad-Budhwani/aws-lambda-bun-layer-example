import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Runtime, Function, Code, LayerVersion, FunctionUrlAuthType, Architecture} from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import {CfnOutput} from "aws-cdk-lib";

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);
		
		// The code that defines your stack goes here
		
		const lambdaLayer = LayerVersion.fromLayerVersionArn(this, 'BunLayer', 'arn:aws:lambda:us-east-1:644480493008:layer:bun:1')
		const lambdaFunction = new Function(this, 'BunFunction', {
			runtime: Runtime.PROVIDED_AL2,
			code: Code.fromAsset(path.join(__dirname, '../../app/dist')),
			handler: 'index.fetch', // index is the name of the file and fetch is the name of the function
			layers: [lambdaLayer],
			functionName: 'bun',
			architecture: Architecture.ARM_64, // ARM_64 is the architecture of the lambda function and this will changed based on the bun image architecture
		});
		
		const lambdaUrl = lambdaFunction.addFunctionUrl({
			authType: FunctionUrlAuthType.NONE,
		});
		
		new CfnOutput(this, 'FunctionUrl ', { value: lambdaUrl.url });
	}
}
