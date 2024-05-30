import axios from 'axios';


async function getUidFromIdToken(idToken: string) {
  const { data } = await axios.post(process.env.AUTH_SERVER_URL!!, {
    idToken
  });

  return data.uid;
}



export { getUidFromIdToken };
