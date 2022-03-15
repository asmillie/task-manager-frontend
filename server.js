const express = require('express')
const app = express()
const port = process.env.PORT || 80

app.use(express.static('task-manager'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'task-manager/'}
  );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
