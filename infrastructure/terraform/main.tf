terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.10"
    }
  }

  backend "s3" {
    bucket         = "omniforge-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "OmniForge"
      ManagedBy   = "Terraform"
    }
  }
}

# EKS Cluster
resource "aws_eks_cluster" "omniforge" {
  name    = "omniforge-${var.environment}"
  version = var.kubernetes_version
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids              = aws_subnet.private[*].id
    security_groups         = [aws_security_group.eks_cluster.id]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]

  tags = {
    Name = "omniforge-${var.environment}"
  }
}

# RDS PostgreSQL Instance
resource "aws_rds_cluster" "omniforge" {
  cluster_identifier      = "omniforge-${var.environment}"
  engine                  = "aurora-postgresql"
  engine_version          = "15.2"
  database_name           = "omniforge"
  master_username         = "postgres"
  master_password         = var.db_master_password
  backup_retention_period = var.backup_retention_period
  preferred_backup_window = "03:00-04:00"

  db_subnet_group_name            = aws_db_subnet_group.omniforge.name
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.omniforge.name
  vpc_security_group_ids          = [aws_security_group.rds.id]

  skip_final_snapshot       = var.environment == "dev"
  final_snapshot_identifier = "omniforge-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"

  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = {
    Name = "omniforge-${var.environment}"
  }
}

# S3 Bucket for Assets
resource "aws_s3_bucket" "assets" {
  bucket = "omniforge-assets-${var.environment}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "omniforge-assets"
  }
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Variables
variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Environment name"
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "kubernetes_version" {
  type        = string
  description = "Kubernetes version"
  default     = "1.28"
}

variable "db_master_password" {
  type        = string
  description = "Master password for RDS"
  sensitive   = true
}

variable "backup_retention_period" {
  type        = number
  description = "Backup retention period in days"
  default     = 7
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# IAM Roles
resource "aws_iam_role" "eks_cluster_role" {
  name = "omniforge-eks-cluster-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster_role.name
}

# VPC (simplified - would need more configuration for production)
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "omniforge-vpc-${var.environment}"
  }
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "omniforge-private-${count.index + 1}"
  }
}

resource "aws_db_subnet_group" "omniforge" {
  name       = "omniforge-${var.environment}"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "omniforge"
  }
}

resource "aws_rds_cluster_parameter_group" "omniforge" {
  family = "aurora-postgresql15"
  name   = "omniforge-${var.environment}"
}

# Security Groups
resource "aws_security_group" "eks_cluster" {
  name   = "omniforge-eks-cluster-${var.environment}"
  vpc_id = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name   = "omniforge-rds-${var.environment}"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_cluster.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Outputs
output "eks_cluster_name" {
  value = aws_eks_cluster.omniforge.name
}

output "rds_cluster_endpoint" {
  value = aws_rds_cluster.omniforge.endpoint
}

output "s3_bucket_name" {
  value = aws_s3_bucket.assets.bucket
}
