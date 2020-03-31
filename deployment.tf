provider "aws" {
  region = "us-east-1"
  profile = "zparnold"
}

data "aws_route53_zone" "thefamilycollective" {
  name = "thefamilycollective.co"
}

resource "aws_s3_bucket" "tfc-survey" {
  bucket = "tfc-user-survey-assets"
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST"]
    max_age_seconds = 3000
    allowed_origins = ["*"]
  }
}
data "archive_file" "init" {
  type        = "zip"
  source_dir = "${path.module}/build/"
  output_path = "data.zip"
}

resource "null_resource" "remove_and_upload_to_s3" {
  depends_on = [aws_s3_bucket.tfc-survey]
  provisioner "local-exec" {
    command = "AWS_PROFILE=zparnold aws s3 sync ${path.module}/build/ s3://${aws_s3_bucket.tfc-survey.id} --acl public-read"
  }
  triggers = {
    shaContents = data.archive_file.init.output_sha
  }
}

resource "aws_route53_record" "tfc-survey" {
  name = "survey"
  type = "CNAME"
  zone_id = data.aws_route53_zone.thefamilycollective.zone_id
  records = [aws_cloudfront_distribution.tfc-survey.domain_name]
  ttl = 60
}

resource "aws_route53_record" "tfc-survey-ssl-validation" {
  name = aws_acm_certificate.tfc-survey.domain_validation_options.0.resource_record_name
  type = aws_acm_certificate.tfc-survey.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.thefamilycollective.zone_id
  records = [aws_acm_certificate.tfc-survey.domain_validation_options.0.resource_record_value]
  ttl = 60
}

resource "aws_acm_certificate" "tfc-survey" {
  validation_method = "DNS"
  domain_name = "survey.thefamilycollective.co"

  lifecycle {
    create_before_destroy = true
  }
}
resource "aws_acm_certificate_validation" "default" {
  certificate_arn = aws_acm_certificate.tfc-survey.arn
  validation_record_fqdns = [
    aws_route53_record.tfc-survey-ssl-validation.fqdn]
}

locals {
  s3Origin = "tfcSurveyId"
}

resource "aws_cloudfront_distribution" "tfc-survey" {
  enabled = true
  default_cache_behavior {
    allowed_methods = ["GET", "POST", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"]
    cached_methods = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3Origin
    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }
  default_root_object = "index.html"
  origin {
    domain_name = aws_s3_bucket.tfc-survey.bucket_regional_domain_name
    origin_id = local.s3Origin
  }
  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.tfc-survey.arn
    ssl_support_method = "sni-only"

  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  aliases = ["survey.thefamilycollective.co"]
}

output "cf-distribution" {
  value = aws_cloudfront_distribution.tfc-survey.id
}