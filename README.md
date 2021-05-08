# nlw5_projeto
Projeto da Next Level Week #05. 

## Sites úteis
1. Confecção de diagramas: https://whimsical.com
1. Mustache: parse de template HTML
  https://mustache.github.io/


## Métodos HTTO
1. GET: Buscas 
1. POST: Criação
1. PUT: Alteração 
1. DELETE: Deletar 
1. PATCH: Alterar uma informação específica


## Configuração do projeto
```console
yarn add express
yarn add @types/express -D
yarn add typescript -D
yarn tsc --init
yarn add ts-node-dev -D
```

## Executar a task de execução do projeto
```console
yarn dev
```
## Banco de dados

### Tipos de conexões
1. Drivers nativos
   1. https://node-postgres.com
1. Query Builders
   1. http://knexjs.org
1. Object-Relational Mapping (ORM)
   1. https://typeorm.io
   1. https://sequelize.org

### Configuração para o banco de dados 

```console
yarn add typeorm
yarn add reflect-metadata
yarn add @types/node -D
yarn add sqlite3
```

### Configuração para as migrations

1. Criar script para usar o cliente do TypeOrm
1. Criar a migration
```console
yarn typeorm migration:create -n Connections
```
1. Executar a migration
```console
yarn typeorm migration:run
```
1. Reverter a migration
```console
yarn typeorm migration:revert
```

### Ajustes para as Entities
1. Ajustar o arquivo tsconfig.json
```typescript
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```
1. Adicionar a bibilioteca uuid
```console
yarn add uuid
yarn add @types/uuid -D
```

### Tipos de parâmetros
 1. Route Params => parâmetros de rotas
    1. http://localhost:3333/settings/1
 1. Query Params => Filtros de buscas
    http://localhost:3333/settings/1?search=algumacoisa
 1. Body Params => corpo da requisição 
    ```json
    { "chave": "valor" }
    ```

## WebSockets
1. Socket.io:
   1. https://socket.io
   1. https://www.npmjs.com/package/socket.io
  
### Instalação de pacote
```console
yarn add socket.io
yarn add @types/socket.io -D   
yarn add ejs
yarn add socket.io-client
```

