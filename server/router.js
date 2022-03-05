const express = require('express');

const router = express.Router();
const models = require('../db/models');
// const pool = require('../db/index');

// router.get('/qa/questions', async (req, res) => {
//   const { rows } = await pool.query('SELECT * FROM questions WHERE id = 1');
//   res.send(rows[0]);
// });
router.get('/qa/questions', models.getAllQuestions);

router.get('/qa/questions/:question_id/answers', models.getAllAnswers);

router.post('/qa/questions', models.postQuestion);

router.post('/qa/questions/:question_id/answers', models.postAnswer);

router.put('/qa/questions/:question_id/helpful', models.markQuestionHelpful);

router.put('/qa/answers/:answer_id/helpful', models.markAnswerHelpful);

router.put('/qa/questions/:question_id/report', models.reportQuestion);

router.put('/qa/answers/:answer_id/report', models.reportAnswer);

module.exports = router;
