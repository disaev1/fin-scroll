const express  = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect('mongodb://localhost:27017/local');

const schema = new mongoose.Schema({
  spendings: Array,
  incomes: Array,
  after: Object,
  before: { type: Object, required: false },
  previous: mongoose.ObjectId
});

const PeriodModel = mongoose.model('periods', schema);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.use((__, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

app.get('/', (req, res) => {
  res.send('Root OK!');
});

app.get('/periods', async (__, res) => {
  const periodsDocs = await PeriodModel.find();
  
  res.send(periodsDocs.map(item => _.omit(item.toJSON(), '__v')));
});

app.get('/periods/:id', async (req, res) => {
  const { id } = req.params;
  const period = await PeriodModel.findOne({ _id: id });


  res.send(_.omit(period.toJSON(), '__v'));
});

app.post('/periods', async (req, res) => {
  const newPeriod = new PeriodModel(req.body);

  const savedPeriod = await newPeriod.save();
  
  res.send(_.omit(savedPeriod.toJSON(), '__v'));
});

app.patch('/periods/:id', async (req, res) => {
  const result = await PeriodModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, req.body);

  res.send(_.pick(result, ['n', 'nModified']));
});

app.listen(4000);
