const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
(async () => {
  try {
    const login = await axios.post('http://localhost:8080/auth/login', { email: 'admin@example.com', password: '123' });
    const token = login.data.token;
    const path = 'C:/Windows/Temp/test-image.png';
    if (!fs.existsSync(path)) {
      const b = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
      fs.writeFileSync(path, Buffer.from(b, 'base64'));
    }
    const form = new FormData();
    form.append('file', fs.createReadStream(path));
    const resp = await axios.post('http://localhost:8080/posts/upload', form, { headers: { ...form.getHeaders(), Authorization: 'Bearer ' + token } });
    console.log('upload', resp.status, resp.data);
    const payload = { title: 'Proxy create test', content: 'Proxy create content', imageUrl: resp.data.filename, published: true };
    const resp2 = await axios.post('http://localhost:5174/api/posts', payload, { headers: { Authorization: 'Bearer ' + token } });
    console.log('create', resp2.status, resp2.data);
  } catch (err) {
    console.error('error', err.response?.status, err.response?.data || err.message);
  }
})();
