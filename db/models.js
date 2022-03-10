const pool = require('./index');
const get = require('./get');
const post = require('./post');

module.exports = {

  /// GET ALL QUESTIONS ///
  getAllQuestions: async (req, res) => {
    const productId = req.query.product_id;
    const count = (req.query.count) ? req.query.count : 5;
    const page = (req.query.page) ? req.query.page : 1;
    const getAllQuestionsQuery = get.allQuestions(productId, count, page);

    // const start = Date.now();
    try {
      const { rows } = await pool.query(getAllQuestionsQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
      const result = {
        product_id: req.query.product_id,
        results: rows,
      };
      res.json(result);
    } catch (err) {
      res.status(404).send(`Error retrieving questions: ${err.message}`);
    }
  },

  getAllAnswers: async (req, res) => {
    const questionId = req.params.question_id;
    const count = (req.query.count) ? req.query.count : 5;
    const page = (req.query.page) ? req.query.page : 1;
    const getAllAnswersQuery = get.allAnswers(questionId, count, page);

    // const start = Date.now();
    try {
      const { rows } = await pool.query(getAllAnswersQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
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
  postQuestion: async (req, res) => {
    const {
      body, name, email,
    } = req.body;
    const productId = req.body.product_id;
    const date = Date.now();

    const postQuestionQuery = post.question(productId, body, date, name, email);

    try {
      // const { rows } = await pool.query(postQuestionQuery);
      await pool.query(postQuestionQuery);
      // const duration = Date.now() - date;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(201);
      // res.status(201).send(rows);
    } catch (err) {
      res.status(404).send(`Error adding question: ${err.message}`);
    }
  },

  /// POST AN ANSWER ///
  postAnswer: async (req, res) => {
    const questionId = req.params.question_id;
    const {
      body, name, email, urls,
    } = req.body;
    const date = Date.now();

    const postAnswerQuery = post.answer(questionId, body, date, name, email, urls);

    try {
      // const { rows } = await pool.query(postAnswerQuery);
      await pool.query(postAnswerQuery);
      // const duration = Date.now() - date;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(201);
      // res.status(201).send(rows);
    } catch (err) {
      res.status(404).send(`Error adding answer: ${err.message}`);
    }
  },

  /// MARK HELPFUL ///
  markQuestionHelpful: async (req, res) => {
    const markQuestionHelpfulQuery = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id='${req.params.question_id}';`;
    // const start = Date.now();
    try {
      // const { rows } = await pool.query(markQuestionHelpfulQuery);
      await pool.query(markQuestionHelpfulQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(204);
      // res.send(rows);
    } catch (err) {
      res.status(404).send(`Error marking question as helpful: ${err.message}`);
    }
  },

  markAnswerHelpful: async (req, res) => {
    const markAnswerHelpfulQuery = `EXPLAIN ANALYZE UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id='${req.params.answer_id}';`;
    // const start = Date.now();
    try {
      // const { rows } = await pool.query(markAnswerHelpfulQuery);
      await pool.query(markAnswerHelpfulQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(204);
      // res.send(rows);
    } catch (err) {
      res.status(404).send(`Error marking answer as helpful: ${err.message}`);
    }
  },

  /// REPORT ///
  reportQuestion: async (req, res) => {
    const reportQuestionQuery = `EXPLAIN ANALYZE UPDATE questions SET reported = true WHERE question_id='${req.params.question_id}';`;
    // const start = Date.now();
    try {
      // const { rows } = await pool.query(reportQuestionQuery);
      await pool.query(reportQuestionQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(204);
      // res.send(rows);
    } catch (err) {
      res.status(404).send(`Error reporting question: ${err.message}`);
    }
  },

  reportAnswer: async (req, res) => {
    const reportAnswerQuery = `EXPLAIN ANALYZE UPDATE answers SET reported = true WHERE answer_id='${req.params.answer_id}';`;
    // const start = Date.now();
    try {
      // const { rows } = await pool.query(reportAnswerQuery);
      await pool.query(reportAnswerQuery);
      // const duration = Date.now() - start;
      // console.log('executed query', { duration, rows: rows.length });
      res.sendStatus(204);
      // res.send(rows);
    } catch (err) {
      res.status(404).send(`Error reporting answer: ${err.message}`);
    }
  },

};
