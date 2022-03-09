module.exports = {
  question: (productId, body, date, name, email) => (
    `INSERT INTO
      questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
    VALUES
      ('${productId}', '${body}', '${date}', '${name}', '${email}', 'f', '0');`
  ),
  answer: (questionId, body, date, name, email, urls) => {
    const postAnswerQueryNoURLs = `INSERT INTO
                                     answers (question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
                                   VALUES
                                     ('${questionId}', '${body}', '${date}', '${name}', '${email}', 'f', '0');`;

    const postAnswerQueryURLs = `EXPLAIN ANALYZE WITH insertAns AS (
                                   INSERT INTO
                                     answers (question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
                                   VALUES
                                     ('${questionId}', '${body}', '${date}', '${name}', '${email}', 'f', '0')
                                   RETURNING answer_id
                                   )
                                 INSERT INTO
                                   answers_photos (answer_id, url)
                                 VALUES (
                                   (SELECT answer_id FROM insertAns),
                                   UNNEST(STRING_TO_ARRAY('${urls}', ','))
                                 );`;

    const postAnswerQuery = (urls) ? postAnswerQueryURLs : postAnswerQueryNoURLs;
    return postAnswerQuery;
  },
};
