const express  = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/local');
const schema = new mongoose.Schema({ spendings: Array, incomes: Array, after: Object, previous: mongoose.ObjectId }, );
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
  res.send(result.map(item => _.omit(item, '__v')));
});

app.post('/periods', async (req, res) => {
  const allPeriods = await PeriodModel.find();

  const prevs = allPeriods.map(period => period.previous ? period.previous.toString() : null);
  console.log('prevs', prevs);
  const lastPeriod = allPeriods.find(period => !prevs.includes(period._id.toString()));
  console.log('body is', req.body, typeof req.body);
  const newPeriod = new PeriodModel({ ...req.body, previous: lastPeriod ? lastPeriod._id : null });

  const savedPeriod = await newPeriod.save();
  const previousPeriod = await PeriodModel.findById(savedPeriod.previous);
  console.log({ savedPeriod: savedPeriod.toJSON(), previousPeriod: previousPeriod.toJSON() });

  res.send(_.omit({ ...savedPeriod.toJSON(), before: previousPeriod.toJSON().after }, '__v'));

});

app.patch('/periods/:id', async (req, res) => {
  console.log('req.params are', req.params);
  const result = await PeriodModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body);
  console.log('result is', result);

  res.send(_.pick(result, ['n', 'nModified']));
});

app.listen(4000);
