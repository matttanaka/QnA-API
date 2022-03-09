import http from 'k6/http';
import { sleep, check } from 'k6';
// import { Counter } from 'k6/metrics';

// export const requests = new Counter('http_reqs');

export const options = {
  vus: 200,
  duration: '30s',
};

export default function () {
  // // generate random product_id from questions
  // const randomID = Math.floor(Math.random() * 1000011);
  // const url = `http://localhost:3000/qa/questions?product_id=${randomID}`;

  // generate random question_id from answers
  const randomID = Math.floor(Math.random() * 3518963);
  const url = `http://localhost:3000/qa/questions/${randomID}/answers`;

  const res = http.get(url);
  sleep(1);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'transaction time < 200 ms': (r) => r.timings.duration < 200,
    'transaction time < 500 ms': (r) => r.timings.duration < 500,
    'transaction time < 1000 ms': (r) => r.timings.duration < 1000,
    'transaction time < 2000 ms': (r) => r.timings.duration < 2000,
  });
}

// MAX question_id: 3,518,968
// [0, 351896, 1583535, 1935432, 3343019, 3518968]

// MAX answer_id: 6,879,309
// [0, 687930, 3095689, 3783619, 6535343, 6879309]

// MAX answers_photos id: 2,063,763
// [0, 206376, 928693, 1135069, 1960574, 2063763]
