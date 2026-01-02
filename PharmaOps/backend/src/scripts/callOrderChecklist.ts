import axios from 'axios';

const id = process.argv[2] || '93ef3713-4ca2-41fb-8ab3-26c446e4b7f6';

async function run() {
  try {
    const res = await axios.post(`http://localhost:4000/api/orders/${id}/checklist`);
    console.log('status', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err: any) {
    if (err.response) {
      console.log('status', err.response.status);
      console.log(err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

run();
