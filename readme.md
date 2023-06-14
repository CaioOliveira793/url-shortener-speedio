# Desafio Técnico - Serviço de Encurtamento de URLs

Neste desafio implementei um serviço de encurtamento de URLs utilizado Node.js no backend e VueJS no frontend

[Vídeo de apresentação do projeto](https://drive.google.com/file/d/1XXyQREL2OUUFfULNLpqC5rlAwG0jDT5U/view?usp=sharing)

## Utilização

No diretório raiz do projeto, é encontrado um arquivo `docker-compose.yaml` no qual é utilizado para instanciar todos os serviços que compôem a aplicação.

Executando `docker-compose up --build` ou `podman-compose up --build` todos os containers necessários serão iniciados.

- nginx `-> PORT 8080`
- backend `-> PORT 3333`
- frontend `-> PORT 4000`

Navegando até [`http://localhost:8080`](http://localhost:8080) será possível encontrar a interface da aplicação pronta para uso.

## Melhorias

Embora a funcionalidade principal de criação e redirecionamento de URLs tenha sido satisfeita, o projeto deixa de implementar algumas funcionalidades e técnicas que solucionam o desafio de forma mais eficiente.

### Geração de chaves (Key Generation Service)

Para realizar o encurtamento de uma url é necessário criar uma chave curta que aponte a url de destino. Baseado nestas características, um dos principais fatores de escalabilidade para este tipo de workload é a capacidade de **gerar chaves unicas** e com o mínimo comprimento possível (requerimento que inibe o uso de IDs únicos como o `UUID`, que usa de um alto fator de entropia para reduzir a probabilidade de chaves duplicadas).

Por se tratar de um problema já estudado na area da computação, poderia ser implementado um serviço que tivesse as caracteristicas de escalabilidade requisitadas pela aplicação.

### Testes e2e

Embora a utilização de uma linguagem como o Typescript que possibilita a análise estática do código e verificação de erros em tempo de desenvolvimento, a adição de testes automatizados possibilita a **verificação de funcionalidades e regras de negócio** ao longo do desenvolvimento e anteriormente a sua publicação, ajudando a garantir o **funcionamento correto** mesmo após alterações no código.

### Rastreamento de acessos baseado em logs

Atualmente todos os acessos são rastreados por contagem, possibilitando saber **quantos** acessos uma url teve. Utilizando logs (dados não estruturados ordenados por tempo) ou **registros de acesso** seria possível fazer outros tipos de análises, como descobrir qual periodo do dia uma url mais tem acesso ou qual região mais acessa a url dependendo das informações inseridas nos logs.

## Documentação API backend

> Utilizando a ferramenta [`curl`](https://curl.se/) é possível interagir com o backend através da CLI, sem a necessidade do frontend.

### Criar usuário

```sh
curl --silent \
	--request POST http://localhost:3333/iam/user \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--data '{"name":"Fake user","email":"fake.user@email.com","password":"12345678"}';
```

### Autenticar usuário

```sh
curl --silent \
	--request POST http://localhost:3333/iam/auth \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--data '{"email":"fake.user@email.com","password":"12345678"}';
```

### Criar url curta

```sh
curl --silent \
	--request POST http://localhost:3333/short_url/url \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--data '{"long_url":"https://example.com","expires":null}';
```

### Criar url curta para usuário autenticado

```sh
curl --silent \
	--request POST http://localhost:3333/short_url/url \
	--header 'Content-Type: application/json' \
	--header 'Accept: application/json' \
	--header "Authorization: Bearer $auth_token" \
	--data '{"long_url":"https://example.com","expires":null}';
```

### Consultar url (recurso)

```sh
curl --silent \
	--request GET http://localhost:3333/short_url/url/$slug \
	--header 'Accept: application/json' \
```

### Consultar url (redirecionamento)

```sh
curl --silent \
	--request GET http://localhost:3333/short_url/url/location/$slug \
	--header 'Accept: application/json' \
```
