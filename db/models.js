const pool = require('./index');

module.exports = {

  getAllQuestions: async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM questions WHERE id = 1');
    res.send(rows[0]);
  },

  getAllAnswers: (req, res) => {
    const reqInfo = {
      urlParams: req.params.question_id,
      queryParams: req.query,
      type: 'get all answers for question',
    };
    res.send(reqInfo);
  },

  postQuestion: (req, res) => {
    const reqInfo = {
      bodyParams: req.body,
      type: 'post a question',
    };
    res.send(reqInfo);
  },

  postAnswer: (req, res) => {
    const reqInfo = {
      urlParams: req.params.question_id,
      bodyParams: req.body,
      type: 'post an answer',
    };
    res.send(reqInfo);
  },

  markQuestionHelpful: (req, res) => {
    const reqInfo = {
      urlParams: req.params.question_id,
      type: 'mark if question helpful',
    };
    res.send(reqInfo);
  },

  reportQuestion: (req, res) => {
    const reqInfo = {
      urlParams: req.params.question_id,
      type: 'report question',
    };
    res.send(reqInfo);
  },

  markAnswerHelpful: (req, res) => {
    const reqInfo = {
      urlParams: req.params.answer_id,
      type: 'mark if answer helpful',
    };
    res.send(reqInfo);
  },

  reportAnswer: (req, res) => {
    const reqInfo = {
      urlParams: req.params.answer_id,
      type: 'report answer',
    };
    res.send(reqInfo);
  },

};
