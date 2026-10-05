## Elastic Beanstalk deployment

1. Create IAM user.

2. Create access key for this user:
   {user} -> Security credentials -> Access keys -> Create access key

3. Configure AWS CLI by typing:
   ```bash
   aws configure
   ```

4. Deploy CloudFormation by typing:
   ```bash
   cdk bootstrap
   ```
   ```bash
   cdk synth
   ```
   ```bash
   cdk deploy
   ```