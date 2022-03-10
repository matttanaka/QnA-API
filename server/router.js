const express = require('express');

const router = express.Router();
const models = require('../db/models');

require('dotenv').config();

router.get(`/${process.env.LOADERIO}`, async (req, res) => {
  try {
    res.send(process.env.LOADERIO);
  } catch (err) {
    res.status(404).send(`Error verifying loader.io target: ${err.message}`);
  }
});

router.get('/qa/questions', models.getAllQuestions);

router.get('/qa/questions/:question_id/answers', models.getAllAnswers);

router.post('/qa/questions', models.postQuestion);

router.post('/qa/questions/:question_id/answers', models.postAnswer);

router.put('/qa/questions/:question_id/helpful', models.markQuestionHelpful);

router.put('/qa/answers/:answer_id/helpful', models.markAnswerHelpful);

router.put('/qa/questions/:question_id/report', models.reportQuestion);

router.put('/qa/answers/:answer_id/report', models.reportAnswer);

module.exports = router;
