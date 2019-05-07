# ecomplus-app-server
App setup and authentication as microservice with Express

##### Instalando
``` npm i -g ecomplus-app-server```
##### Rodando
``` ecomplus-app-server --config path/to/ecomplus-app-server-config.json ```
##### ecomplus-app-server-config.json exemplo;
```json
{
  "port": 3000,
  "webhook": "https://myurl.com/notifications",
  "ecom_auth_db": "path/to/database.sqlite",
  "token": "bfPPm4fQfglZQBii3azZ4uu2rZgo",
  "procedures": [
    {
      "title": "Procedures Name",
      "triggers": [
        {
          "resource": "products"
        }
      ],
      "webhooks": [
        {
          "api": {
            "external_api": {
              "uri": "https://my-app.com/blablabler"
            }
          },
          "method": "POST",
          "send_body": true
        }
      ]
    }
  ]
}
```
##### Definições
| Propriedade | Exemplo | Descrição. | Default | Obrigatório |
|-----|-----|-------|-----|-----|
| port | 8000 | Porta que o aplicativo escuta | 3000 | Não
| webhook | http://meucallback.com| Url que receberá notificação sempre que o aplicativo for instalado em alguma loja. | | Não
| ecom_auth_db |/var/dbs/ecom_auth_db.sqlite| Banco local onde serão salvos dados referente a instalação do aplicativo nas lojas. | | Sim
| token | bfPPm4fQfglZQBii3azZ4uu2rZgo | token da aplicação, se não informado a aplicação irá ignorar o token enviado no header das requisições ou a falta dele. | | Não
| procedures | | array de procedures que serão registrado em todas as lojas que instalarem o aplicativo. Se informado deve seguir o schema da ecomplus-api. [Link](https://developers.e-com.plus/docs/api/#/store/procedures) | | Não
____
##### Aplicação
Após instalar e rodar o aplicativo, um servidor local será criado possibilitando acesso aos seguintes recursos da aplicação; Buscar Credenciais, Instalar o aplicativo em alguma loja específica e verificar quais lojas estão instaladas.

Para consumir os recursos basta acessar a url do seu localhost : porta definida na configuração do aplicativo, ou localhost:3000 caso a porta não seja informada o json de configuração.

##### Recursos
| Recurso | Descrição | Método | Headers
|---------|------|---------|-------|
|/callback| Instala a aplicação em alguma loja específica | POST | X-Store-Id
|/store| Retorna lojas instaladas |POST|X-Token (Se informado na config.json)
|/credentials|Retorna my_id e access_token de determinada loja.| POST| X-Store-Id, X-Token (se informado na config.json)

> /callback

Quando adicionar o aplicativo ao [market](https://market.e-com.plus), deve ser configurado a url de callback para o seu aplicativo, que por sua vez, deverá apontar todas as requisições de callback da api da ecomplus para o seu servidor local.

> /store

Request
```bash 
curl -X POST \
  http://localhost:3000/stores \
  -H 'X-Token: bfPPm4fQfglZQBii3azZ4uu2rZgo'
```
Response 
```json
[
    {
        "store_id": 9989
    },
     {
        "store_id": 1002
    }
]
```
> /credentials

Request
```bash
curl -X POST \
  http://localhost:3000/credentials \
  -H 'X-Store-id: 9989' \
  -H 'X-token: bfPPm4fQfglZQBii3azZ4uu2rZgo' \
  ```
  Response
  ```json
  {
    "access_token": "eyJpc3MiOiI1Y2NiMmJiNzg4N2VmNDMwZ.eyJpc3MiOiI1Y2NiMmJiNzg4N2VmNDMwZjFmNjk0NGEiLCJjb2QiOjg3OTAyMTk0LCJleHAiOjE1NTczMjU4MDA2OTJ9.q84wYC8_7zqDQC8ycAdUHrcW4QL2lhuGBbUuabsc-dsd-",
    "my_id": "5ccb2bb7887ef786g158912e"
}
  ```