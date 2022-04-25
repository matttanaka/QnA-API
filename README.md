# Questions & Answers API
I was tasked with revamping a legacy API of an e-commerce website so that it was optimized for high web traffic. I worked with two other engineers, and each of us focused on a different service of the website. I was responsible for building out the Questions & Answers service, which is a RESTful API serving all question & answer data for a particular product. This API also allows users to submit questions and answers for a particular product, mark a question or answer as helpful, or report a question or answer to prevent it from being displayed on the product page.

## Tech stack
Express.js/Node.js, PostgreSQL, k6, loader.io, NGINX, AWS EC2, Ubuntu \
![image](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![image](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## Achievements
* Loaded PostgreSQL database with ~25 million data points using an ETL method.
* Reduced PostgresSQL query times from 33 seconds to 18 ms by implementing indexing.
* Increased user throughput by 1600% while keeping error rates <1% by horizontally scaling two EC2 t2.micro instances behind an NGINX load-balancer.

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
* [List Questions](#list-questions)
* [List Answers](#list-answers)
* [Add a Question](#add-a-question)
* [Add an Answer](#add-an-answer)
* [Mark Question as Helpful](#mark-question-as-helpful)
* [Report Question](#report-question)
* [Mark Answer as Helpful](#mark-answer-as-helpful)
* [Report Answer](#report-answer)

### List Questions
`GET /qa/questions` Retrieves a list of questions for a particular product. This does not include any reported questions.

#### Query Parameters

| Parameter  | Type    | Description                                               |
| ---------  | ------- | --------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.    |
| page       | integer | Selects the page of results to return.  Default 1.        |
| count      | integer | Specifies how many results per page to return. Default 5. |

#### Response

`Status: 200 OK`

#### Example Response

```json
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": false,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": false,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```

### List Answers
`GET /qa/questions/:question_id/answers` Returns answers for a given question. This does not include any reported answers.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the question for which answers are needed. |

#### Query Parameters
| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| page        | integer | Selects the page of results to return.  Default 1.        |
| count       | integer | Specifies how many results per page to return. Default 5. |

#### Response

`Status: 200 OK`

#### Example Response

```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

### Add a Question
`POST /qa/questions` Adds a question for the given product.

#### Body Parameters

| Parameter  | Type    | Description                                                  |
| ---------  | ------- | ---------------------------------------------------------    |
| body       | text    | Text of question being asked.                                |
| name       | text    | Username for question asker.                                 |
| email      | text    | Email address for question asker.                            |
| product_id | integer | Required ID of the Product for which the question is posted. |

#### Response

`Status: 201 CREATED`

### Add an Answer
`POST /qa/questions/:question_id/answers` Adds an answer for the given question.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the question to post the answer for.       |

#### Body Parameters

| Parameter  | Type    | Description                                                  |
| ---------  | ------- | ---------------------------------------------------------    |
| body       | text    | Text of answer.                                              |
| name       | text    | Username for answerer.                                       |
| email      | text    | Email address for answerer.                                  |
| photos.    | [text]  | An array of urls corresponding to images to display.         |

#### Response

`Status: 201 CREATED`

### Mark Question as Helpful
`PUT /qa/questions/:question_id/helpful` Updates a question to show it was found helpful.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the question to update.                    |

#### Response

`Status: 204 NO CONTENT`

### Report Question
`PUT /qa/questions/:question_id/report` Updates a question to show it was reported. This action does not delete the question, but the question will not be returned in the above GET request.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the question to update.                    |

#### Response

`Status: 204 NO CONTENT`

### Mark Answer as Helpful
`PUT /qa/answers/:answer_id/helpful` Updates an answer to show it was found helpful.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| answer_id   | integer | Required ID of the answer to update.                      |

#### Response

`Status: 204 NO CONTENT`

### Report Answer
`PUT /qa/answers/:answer_id/report` Updates an asnwer to show it was reported. This action does not delete the answer, but the answer will not be returned in the above GET request.

#### Parameters

| Parameter   | Type    | Description                                               |
| ---------   | ------- | --------------------------------------------------------- |
| answer_id   | integer | Required ID of the answer to update.                      |

#### Response

`Status: 204 NO CONTENT`

## Contribution
* [Matthew Tanaka](https://github.com/matttanaka)
