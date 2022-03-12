module.exports = {
  allQuestions: (productId, count, page) => (
    `SELECT
      questions.question_id,
      question_body,
        TO_CHAR (
          TO_TIMESTAMP(question_date::double precision/1000) AT TIME ZONE 'UTC', 'DD-MM-YYYY"T"HH24:MI:SS.MS"Z"'
        ) AS question_date,
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
              TO_TIMESTAMP(date::double precision/1000) AT TIME ZONE 'UTC', 'DD-MM-YYYY"T"HH24:MI:SS.MS"Z"'
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
      product_id = '${productId}'
    AND
      reported = false
    LIMIT ${count}
    OFFSET ${count * (page - 1)};`
  ),

  allAnswers: (questionId, count, page) => (
    `SELECT
      answers.answer_id,
      body,
      TO_CHAR (
        TO_TIMESTAMP(date::double precision/1000) AT TIME ZONE 'UTC', 'DD-MM-YYYY"T"HH24:MI:SS.MS"Z"'
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
      question_id = '${questionId}'
    AND
      reported = false
    LIMIT ${count}
    OFFSET ${count * (page - 1)};`
  ),
};
