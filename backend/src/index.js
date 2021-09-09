const express  = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/local');
const schema = new mongoose.Schema({ spendings: Array, incomes: Array, after: Array, previous: mongoose.ObjectId });
const PeriodModel = mongoose.model('periods', schema);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
  res.send('Root OK!');
});

app.get('/periods', async (req, res) => {
  
  const result = await PeriodModel.find();
  console.log('result is', result);

  res.header('Content-Type', 'application/json');
  res.send(result);
});

app.post('/periods', async (req, res) => {
  console.log('body is', req.body.data, typeof req.body.data);
  const newPeriod = new PeriodModel({ ...req.body.data, previous: mongoose.Types.ObjectId(req.body.data.previous) });

  await newPeriod.save();

  res.send('OK!');

});

app.patch('/periods/:id', async (req, res) => {
  const result = PeriodModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body.data);

  res.send(_.pick(result, ['n', 'nModified']));
});

app.listen(4000);
