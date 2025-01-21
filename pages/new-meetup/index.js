//our-domain/new-meetup

//Adding 'head' metadatass
// This is a component which allows you to add Head elements to the Head section of your page.
import Head from 'next/head';
import { Fragment } from 'react';

import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetupPage() {
  const router = useRouter();
  async function onAddMeetupHandler(enteredMeetupData) {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    // this is equivalent of using the Link compoenent
    // This will push a new page to the stack of pages (Programmatic (imperative) naigation)
    // if it was a link we could use it as dinamicreate it as path
    router.push('/');
  }

  return (
    <Fragment>
      <Head>
        <title>Add a new Meetups</title>
        <meta
          name="Description"
          content="Create your meetups and find new opportunities."
        />
      </Head>
      <NewMeetupForm onAddMeetup={onAddMeetupHandler} />;
    </Fragment>
  );
}
export default NewMeetupPage;
