//  /api/new-meetup
// POST /api/new-meetup
import { MongoClient } from 'mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    // const { title, image, address, description } = data;

    const client = await MongoClient.connect(
      'mongodb+srv://eltonsouzams:5QNB1tkg6D0xKhyN@cluster0.cqzcg.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
    );

    // MongoDB is a NoSQL database that works with collections full of documents.
    // Collections would be kind of your tables in a SQL database and documents would be your entries in those tables.

    const db = client.db();
    // creating a collection if it does  not exist, and assing it the same name of teh database.
    const meetupsCollection = db.collection('meetups');

    // Insert one document/row in the collection/table by passing an object
    const result = await meetupsCollection.insertOne(data);

    // CLosing the connection
    client.close();
    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;
