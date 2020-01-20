app         = "recommendit-server"
environment = "qa"

internal           = "true"
container_port     = "8030"
replicas           = "1"
health_check       = "/hc"
region             = "us-east-2"
aws_profile        = "personalUse"
saml_role          = "abdevelops"
vpc                = "vpc-0192cd55ea88a6c28"
private_subnets    = "subnet-05edee30329b79f61,subnet-00a8e862a9fe32a9f"
public_subnets     = "subnet-07f07623c123b4286,subnet-0d699211c300bd14d"
secrets_saml_users = []
tags = {
  application = "recommendit-server"
  environment = "qa"
}
