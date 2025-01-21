import { MongoClient, ObjectId } from 'mongodb';

//Adding 'head' metadata
// This is a component which allows you to add Head elements to the Head section of your page.
import Head from 'next/head';

import { Fragment } from 'react';

import MeetupDetail from '../../components/meetups/MeetupDetail';
function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="Description" content={props.meetupData.description} />
      </Head>

      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// if use getStaticProps, you must use the function getStaticPaths
// This is required because Next.js neext to know which dynamic page will be generated
export async function getStaticPaths() {
  // fetch data form an API.

  const client = await MongoClient.connect(
    'mongodb+srv://eltonsouzams:5QNB1tkg6D0xKhyN@cluster0.cqzcg.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
  );

  // MongoDB is a NoSQL database that works with collections full of documents.
  // Collections would be kind of your tables in a SQL database and documents would be your entries in those tables.

  const db = client.db();
  // creating a collection if it does  not exist, and assing it the same name of teh database.
  const meetupsCollection = db.collection('meetups');

  // find all documents/rows in a collection
  // the first argument in the find method is about the filter the documents/rows
  // the second argument in the find method is about the filter fields

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  // CLosing the connection
  client.close();

  return {
    // Set fallback: false, to indicated that I have indicated all paths
    // Set fallback: true, to indicated that only some of teh path is indicated

    // We can set fallback to true, or even better, to 'blocking'. When you set fallback to true or to blocking,
    // you're telling NextJS that the list of paths which you're specifying here, might not be exhaustive,
    // there might be more valid pages. And, therefore, when fallback is set to true or to blocking,
    // NextJS will not respond with a 404 page if it can't find the page immediately.

    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),

    // [
    //   {
    //     params: {
    //       meetupId: 'm1',
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: 'm2',
    //     },
    //   },
    // ],
  };
}

//If you ant to wait for data, it only work in page compoenets file, file under the page folder.
// Next.js will look for a function that with this reserved name and if finded.
// this function will be executed before the conpoened teh component is executed, so data can be get before.
// You could access a file system here or securely connect to a database
// because any code you write in here will never end up on the client side
// and it will never execute on the client side simply because this code is executed
// during the build process, not on the server and especially not on the clients
// of your visitors. So the code in here will never reach the machines
// of your visitors. It will never execute on their machines.
// and you must return an object.

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  // fetch data form an API.

  const client = await MongoClient.connect(
    'mongodb+srv://eltonsouzams:5QNB1tkg6D0xKhyN@cluster0.cqzcg.mongodb.net/meetups?retryWrites=true&w=majority&appName=Cluster0'
  );

  // MongoDB is a NoSQL database that works with collections full of documents.
  // Collections would be kind of your tables in a SQL database and documents would be your entries in those tables.

  const db = client.db();
  // creating a collection if it does  not exist, and assing it the same name of teh database.
  const meetupsCollection = db.collection('meetups');

  // find one single  document/row in a collection
  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  // CLosing the connection
  client.close();

  return {
    props: {
      meetupData: {
        // image: 'https://m.media-amazon.com/images/I/71iR1dn30uL._AC_SX679_.jpg',
        // id: meetupId,
        // title: 'My First image',
        // address: 'Address 1',
        // description: 'Drescription 1',
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
      },
    },

    // This will also be generated every couple of seconds on the server, at least if there are requests for this page.
    // So that means that this page, with revalidate set to 10, would be regenerated on the server at least every 10 seconds if there are requests coming in for this page.
    // And then these regenerated pages would replace the old pre-generated pages. And with that, you would ensure that your data is never older than 10 seconds.
    // And therefore, the number of seconds you wanna use here depends on your data update frequency.
  };
}

export default MeetupDetails;
