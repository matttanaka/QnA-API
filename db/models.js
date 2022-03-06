const pool = require('./index');

module.exports = {

  /// GET ALL QUESTIONS ///
  getAllQuestions: async (req, res) => {
    const page = (req.query.page) ? req.query.page : 1;
    const count = (req.query.count) ? req.query.count : 5;
    const getAllQuestionsQuery = `SELECT
                                    questions.question_id,
                                    question_body,
                                    question_date,
                                    asker_name,
                                    question_helpfulness,
                                    reported,
                                    COALESCE ((
                                      SELECT JSON_AGG(answers)
                                      FROM (
                                        SELECT
                                          answers.answer_id,
                                          body,
                                          TO_CHAR (
                                            TO_TIMESTAMP(date::double precision/1000), 'DD-MM-YYYY"T"HH24:MI:SS.MS"Z"'
                                          ) AS date,
                                          answerer_name,
                                          helpfulness,
                                          COALESCE ((
                                            SELECT JSON_AGG(photos)
                                            FROM (
                                              SELECT
                                                id,
                                                url
                                              FROM
                                                answers_photos
                                              WHERE
                                                answers_photos.answer_id = answers.answer_id
                                            ) AS photos
                                          ), '[]') AS photos
                                        FROM
                                          answers
                                        WHERE
                                          answers.question_id = questions.question_id
                                        AND
                                          reported = false
                                      ) AS answers
                                    ), '[]') AS answers
                                  FROM
                                    questions
                                  WHERE
                                    product_id = '${req.query.product_id}'
                                  AND
                                    reported = false
                                  ORDER BY questions.question_id
                                  LIMIT ${count}
                                  OFFSET ${count * (page - 1)};`;
    try {
      const { rows } = await pool.query(getAllQuestionsQuery);
      const result = {
        product_id: req.query.product_id,
        results: rows,
      };
      res.json(result);
    } catch (err) {
      res.status(404).send(`Error retrieving questions: ${err.message}`);
    }
  },

  /// GET ALL ANSWERS ///  I think I can use a formula that returns this query with the params.quesiton_id as an input

  getAllAnswers: async (req, res) => {
    const page = (req.query.page) ? req.query.page : 1;
    const count = (req.query.count) ? req.query.count : 5;
    const getAllAnswersQuery = `SELECT
                                  answers.answer_id,
                                  body,
                                  TO_CHAR (
                                    TO_TIMESTAMP(date::double precision/1000), 'DD-MM-YYYY"T"HH24:MI:SS.MS"Z"'
                                  ) AS date,
                                  answerer_name,
                                  helpfulness,
                                  COALESCE ((
                                    SELECT JSON_AGG(photos)
                                    FROM (
                                      SELECT
                                        id,
                                        url
                                      FROM
                                        answers_photos
                                      WHERE
                                        answers_photos.answer_id = answers.answer_id
                                    ) AS photos
                                  ), '[]') AS photos
                                FROM
                                  answers
                                WHERE
                                  question_id = '${req.params.question_id}'
                                AND
                                  reported = false
                                ORDER BY answers.answer_id
                                LIMIT ${count}
                                OFFSET ${count * (page - 1)};`;

    try {
      const { rows } = await pool.query(getAllAnswersQuery);
      const result = {
        question: req.params.question_id,
        page,
        count,
        results: rows,
      };

      res.json(result);
    } catch (err) {
      res.status(404).send(`Error retrieving answers: ${err.message}`);
    }
  },

  /// POST A QUESTION ///
  postQuestion: (req, res) => {
    const reqInfo = {
      bodyParams: req.query,
      // bodyParams: req.body,
      type: 'post a question',
    };
    res.send(reqInfo);
  },

  /// POST AN ANSWER ///
  postAnswer: (req, res) => {
    const reqInfo = {
      urlParams: req.params.question_id,
      bodyParams: req.body,
      type: 'post an answer',
    };
    res.send(reqInfo);
  },

  /// MARK HELPFUL ///
  markQuestionHelpful: async (req, res) => {
    try {
      await pool.query(`UPDATE questions SET question_helpfulness = question_helpfulness::integer + 1 WHERE question_id='${req.params.question_id}'`);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send(`Error marking question as helpful: ${err.message}`);
    }
  },

  markAnswerHelpful: async (req, res) => {
    try {
      await pool.query(`UPDATE answers SET helpfulness = helpfulness::integer + 1 WHERE answer_id='${req.params.answer_id}'`);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send(`Error marking answer as helpful: ${err.message}`);
    }
  },

  /// REPORT ///
  reportQuestion: async (req, res) => {
    try {
      await pool.query(`UPDATE questions SET reported = true WHERE quesion_id='${req.params.question_id}'`);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send(`Error reporting question: ${err.message}`);
    }
  },

  reportAnswer: async (req, res) => {
    try {
      await pool.query(`UPDATE answers SET reported = true WHERE answer_id='${req.params.answer_id}'`);
      res.sendStatus(204);
    } catch (err) {
      res.status(404).send(`Error reporting answer: ${err.message}`);
    }
  },

};

// GET ALL ANSWERS TEST QUERIES

// V3.0 figured out how to return [] for null responses
// const getAllAnswersQuery = `SELECT
//                                 answers.answer_id,
//                                 body,
//                                 date,
//                                 answerer_name,
//                                 helpfulness,
//                                 COALESCE ((
//                                   SELECT JSON_AGG(photos)
//                                   FROM (
//                                     SELECT id, url FROM answers_photos WHERE answers_photos.answer_id = answers.answer_id
//                                   ) AS photos
//                                 ), '[]') AS photos
//                               FROM
//                                 answers
//                               WHERE
//                                 question_id = '${req.params.question_id}'
//                               AND
//                                 reported = false;`;

// V2.0 figured out how to put all rows from answers_photos into photos column
// const getAllAnswersQuery = `SELECT
//                               answers.answer_id,
//                               body,
//                               date,
//                               answerer_name,
//                               helpfulness,
//                               (
//                                 SELECT json_agg(photos)
//                                 FROM (
//                                   SELECT id, url FROM answers_photos WHERE answers_photos.answer_id = answers.answer_id
//                                 ) AS photos
//                               ) AS photos
//                             FROM
//                               answers
//                             WHERE
//                               question_id = '${req.params.question_id}'
//                             AND
//                               reported = false;`;

// V1.0: figuring out how to put all rows from answers_photos into photos column
// const getAllAnswersQuery = `SELECT
//                               answers.answer_id,
//                               body,
//                               date,
//                               answerer_name,
//                               helpfulness,
//                               (
//                                 SELECT
//                                   url
//                                 FROM
//                                   answers_photos
//                                 WHERE
//                                   answers_photos.answer_id = answers.answer_id
//                               ) AS photos
//                             FROM
//                               answers
//                             WHERE
//                               question_id = '${req.params.question_id}'
//                             AND
//                               reported = false;`;
