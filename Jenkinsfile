#!groovy
library 'pipeline-library'

def isMaster = env.BRANCH_NAME.equals('master')

buildModule {
	sdkVersion = '9.0.0.v20200128095338'
	npmPublish = isMaster // By default it'll do github release on master anyways too
}
