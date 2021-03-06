const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 8080

app.use(express.static('./dist/task-manager'));

app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/task-manager/'}
  );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
