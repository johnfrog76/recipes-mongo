# recipes-mongo

### Swagger
- swagger is served from api url ```/api-docs/```
- Authorize modal must include ```'Bearer' + <token>```

### Deployment Workflows
- Heroku CI
  - https://devcenter.heroku.com/articles/github-integrationd
- Heroku CLI (example workflow)

>
> curl https://cli-assets.heroku.com/install.sh | sh
>
> heroku login
>
> heroku git:clone -a <YOUR-APP-NAME>
> (will be empty)
>
> git remote add origin <YOUR-REPO-URL>
>
> git pull origin master
>
> git commit -m 'changes'
>
> git push origin master
>
> git push heroku master
>