import axios from 'axios';

async function run() {
  const url = process.argv[2] || 'http://localhost:5174/';
  try {
    const res = await axios.get(url, { timeout: 5000 });
    console.log('status', res.status);
    console.log(res.data.substring(0, 200));
  } catch (err: any) {
    if (err.response) {
      console.error('status', err.response.status);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

run();
