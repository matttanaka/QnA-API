const pool = require('./index');

module.exports = {

  /// GET ALL QUESTIONS ///
  getAllQuestions: async (req, res) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM questions WHERE product_id = '${req.query.product_id}';`);
      res.json(rows);
    } catch (err) {
      res.status(404).send(`Error retrieving questions: ${err.message}`);
    }
  },

  /// GET ALL ANSWERS ///
  getAllAnswers: async (req, res) => {
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

    // VERY CLOSE TO WHAT I WANT:
    const getAllAnswersQuery = `SELECT
                                  answers.answer_id,
                                  body,
                                  date,
                                  answerer_name,
                                  helpfulness,
                                  (
                                    SELECT json_agg(photos)
                                    FROM (
                                      SELECT id, url FROM answers_photos WHERE answers_photos.answer_id = answers.answer_id
                                    ) AS photos
                                  ) as photos
                                FROM
                                  answers
                                WHERE
                                  question_id = '${req.params.question_id}'
                                AND
                                  reported = false;`;

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
    //                               question_id = '1'
    //                             AND
    //                               reported = false;`;
    try {
      const { rows } = await pool.query(getAllAnswersQuery);
      res.json(rows);
    } catch (err) {
      res.status(404).send(`Error retrieving answers: ${err.message}`);
    }
  },

  /// POST A QUESTION ///
  postQuestion: (req, res) => {
    const reqInfo = {
      bodyParams: req.body,
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
