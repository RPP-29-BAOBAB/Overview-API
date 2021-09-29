import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 2500,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3001/products/9999/styles');
  sleep(1);
}
