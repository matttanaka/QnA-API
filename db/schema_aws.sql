DROP DATABASE IF EXISTS qna;

CREATE DATABASE qna;

\c qna;

-- Initiate questions table

CREATE TABLE IF NOT EXISTS questions_temp (
  id integer,
  product_id integer,
  body text,
  date_written bigint,
  asker_name varchar(50),
  asker_email varchar(255),
  reported boolean,
  helpful integer
);

COPY questions_temp
FROM '/home/ubuntu/SDC_data/questions.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE IF NOT EXISTS questions (
  question_id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  product_id integer,
  question_body text,
  question_date bigint,
  asker_name varchar(50),
  asker_email varchar(255),
  reported boolean,
  question_helpfulness integer
);

INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
SELECT product_id, body, date_written, asker_name, asker_email, reported, helpful
FROM questions_temp;

CREATE INDEX idx_questions_productid ON questions(product_id);

DROP TABLE questions_temp;

-- Initiate answers table

CREATE TABLE IF NOT EXISTS answers_temp (
  id integer,
  question_id integer,
  body text,
  date_written bigint,
  answerer_name varchar(50),
  answerer_email varchar(255),
  reported boolean,
  helpful integer,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

COPY answers_temp
FROM '/home/ubuntu/SDC_data/answers.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE IF NOT EXISTS answers (
  answer_id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  question_id integer,
  body text,
  date bigint,
  answerer_name varchar(50),
  answerer_email varchar(255),
  reported boolean,
  helpfulness integer,
  FOREIGN KEY (question_id) REFERENCES questions (question_id)
);

INSERT INTO answers (question_id, body, date, answerer_name, answerer_email, reported, helpfulness)
SELECT question_id, body, date_written, answerer_name, answerer_email, reported, helpful
FROM answers_temp;

CREATE INDEX idx_answers_questionid ON answers(question_id);

DROP TABLE answers_temp;

-- Initiate answers_photo table

CREATE TABLE IF NOT EXISTS answers_photos_temp (
  id integer,
  answer_id int,
  photo_url text,
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
);

COPY answers_photos_temp
FROM '/home/ubuntu/SDC_data/answers_photos.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE IF NOT EXISTS answers_photos (
  id integer GENERATED BY DEFAULT AS IDENTITY UNIQUE PRIMARY KEY,
  answer_id int,
  url text,
  FOREIGN KEY (answer_id) REFERENCES answers (answer_id)
);

INSERT INTO answers_photos (answer_id, url)
SELECT answer_id, photo_url
FROM answers_photos_temp;

CREATE INDEX idx_answers_photos_answerid ON answers_photos(answer_id);

DROP TABLE answers_photos_temp;