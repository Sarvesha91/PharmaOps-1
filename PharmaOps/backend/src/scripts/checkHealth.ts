import axios from 'axios';

async function run() {
  const url = process.argv[2] || 'http://localhost:4001/api/health';
  try {
    const res = await axios.get(url, { timeout: 3000 });
    console.log('status', res.status);
    console.log(res.data);
  } catch (err: any) {
    if (err.response) {
      console.error('status', err.response.status, err.response.data);
    } else {
      console.error('error', err.message);
    }
    process.exit(1);
  }
}

run();
