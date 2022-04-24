# Questions & Answers API
I was tasked with revamping a legacy API of an e-commerce website so that it was optimized for high web traffic. I worked with two other engineers, and each of us focused on a different service of the website. I was responsible for building out the Questions & Answers service, which is a RESTful API serving the questions & answers data for a particular product.

## Tech stack
Express.js/Node.js, PostgreSQL, k6, loader.io, NGINX, AWS EC2, Ubuntu \
![image](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![image](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## Installation/Setup
1. Fork and Clone this repo.

2. Install dependences
```
npm install
```
3. Run server on local environment
```
npm start
```
4. Create a .env file in the root directory. Within the file, include the following database parameters:
```
HOST=
PORT=
USER=
PASSWORD=
DATABASE=
```
## Endpoints
* [List Questions]()
* [List Answers]()
* [Add a Question]()
* [Add an Answer]()
* [Mark Question as Helpful]()
* [Report Question]()
* [Mark Answer as Helpful]()
* [Report Answer]()

### List Questions
`GET /qa/questions` Retrieves a list of questions for a particular product. This does not include any reported questions.

Parameters

| Parameter  | Type    | Description                                               |
| ---------  | ------- | --------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.        |
| page       | integer | Selects the page of results to return.  Default 1.        |
| count      | integer | Specifies how many results per page to return. Default 5. |
