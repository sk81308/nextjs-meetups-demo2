//our-domain

//Adding 'head' metadata
// This is a component which allows you to add Head elements to the Head section of your page.
import Head from 'next/head';

import { Fragment } from 'react';

// when you import something here in a page component file and that something is then only used in getServerSideProps
// or getStaticProps, the imported package will not be part of the client side bundle.
// So you can import code here which will then only be executed on the server, and nextJS will detect this
// and not include it in your client's side bundle, which is good both for bundle size considerations as well as for security.
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUP = [
//   {
//     id: 'm1',
//     title: 'Image 1',
//     image: 'https://placebear.com/g/200/200',
//     address: 'address 1',
//     description: 'descriptio 1',
//   },
//   {
//     id: 'm2',
//     title: 'Image 2',
//     image: 'https://m.media-amazon.com/images/I/71iR1dn30uL._AC_SX679_.jpg',
//     address: 'address 2',
//     description: 'descriptio 2',
//   },
//   {
//     id: 'm3',
//     title: 'Image 3',
//     image: 'https://m.media-amazon.com/images/I/71oxVgg8nhL._AC_SX679_.jpg',
//     address: 'address 3',
//     description: 'descriptio 3',
//   },
//   {
//     id: 'm4',
//     title: 'Image 4',
//     image: 'https://m.media-amazon.com/images/I/71eeiUneuGL._AC_SX466_.jpg',
//     address: 'address 4',
//     description: 'descriptio 4',
//   },
//   {
//     id: 'm5',
//     title: 'Image 5',
//     image:
//       'https://m.media-amazon.com/images/I/91WblzJjm6L.__AC_SX300_SY300_QL70_ML2_.jpg',
//     address: 'address 5',
//     description: 'descriptio 5',
//   },
// ];

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name="Description" content="Browser a list of react meetups." />
      </Head>

      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
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

export async function getStaticProps() {
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
  const meetups = await meetupsCollection.find().toArray();

  // CLosing the connection
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
      })),
    },

    // This will also be generated every couple of seconds on the server, at least if there are requests for this page.
    // So that means that this page, with revalidate set to 10, would be regenerated on the server at least every 10 seconds if there are requests coming in for this page.
    // And then these regenerated pages would replace the old pre-generated pages. And with that, you would ensure that your data is never older than 10 seconds.
    // And therefore, the number of seconds you wanna use here depends on your data update frequency.

    revalidate: 10,
  };
}

// ----------------------------------------------------------------------------------------//

// // This function will now not run during the build process, but instead always on the server after deployment.
// // Any code you write in here will always run on the server, never in the client.
// // So you can run the server side code in here, you can also perform operations that use credentials that should not be exposed to your users,
// // because this code only runs on the server. And then ultimately, you return your props object.

// export async function getServerSideProps(context) {
//   // You also get access to the request object under direct key, and the response objec that will be sent back.
//   // And if you worked with NodeJS and Express before, this might look familiar to you.
//   // There, you also get request and response objects in your middleware to then work with those.
//   // And especially having access to the concrete request object can be helpful.
//   // For example, when you're working with authentication, and you need to check some session cookie or anything like this.

//   // const req = context.req;
//   // const res = context.res;

//   // fetch data form an API.
//   return {
//     props: {
//       meetups: DUMMY_MEETUP,
//     },
//   };
// }
export default HomePage;
