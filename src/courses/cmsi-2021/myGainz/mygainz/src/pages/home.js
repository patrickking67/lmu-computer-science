import { useOutletContext } from "react-router-dom";
import { InitiateSignIn } from '../services/authService';
import { useState, useEffect } from 'react';
import moment from 'moment';

export default function Home() {
  const user = useOutletContext();
  const [quote, setQuote] = useState("Loading motivation...");

  useEffect(() => {
    (async () => {
      const response = await fetch("https://type.fit/api/quotes");
      const json = await response.json();
      const randomQuote = json[Math.floor(Math.random() * json.length)];
      setQuote(randomQuote);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="page-header">Home</h1>
        {user ? <div>
          <h2 className="page-header text-gray-500 text-base font-light">Welcome back, <span className="font-medium">{user.displayName}</span></h2>
          <h2 className="page-header text-gray-500 text-base font-light">Tracking gainz since: <span className="text-blue-500">{moment(user.metadata.creationTime).format('llll')} </span></h2>
          <h2 className="page-header text-gray-500 text-base font-light">Last login at: <span className="text-blue-500">{moment(user.metadata.lastLoginTime).format('llll')}</span> </h2>
        </div>
          : <h2 className="page-header text-gray-500 text-base font-light">You aren't signed in. You can <a href="/exercises" className="text-blue-500 font-medium">browse exercises</a> or <span onClick={InitiateSignIn} className="text-blue-500 font-medium cursor-pointer">click here</span>  to sign in</h2>
        }
      </div>
      <div className="mt-12 bg-gray-100 border-2 border-slate-200 rounded-lg p-8 max-w-2xl">
        <h1 className="text-gray-500 text-lg">"{quote.text}"  - {quote.author}</h1>
      </div>
      {user && <h2 className="page-header text-gray-500 text-base font-light">Ready? It's time to <a href="/exercises" className="text-blue-500 font-medium">browse exercises</a> or <a href="/programs" className="text-blue-500 font-medium">track your progress</a>!</h2>}
    </div >
  );
}
