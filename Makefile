deploy:
	terraform apply -auto-approve
	aws cloudfront create-invalidation --distribution-id $(terraform output cf-distribution) --paths "/*" --profile zparnold --region us-east-1