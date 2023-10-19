import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };
    // to make sure "this" is bound to the instance of the class JokeList, need to bind all functions in the constructor
    this.vote = this.vote.bind(this);
  }

  // after component renders for the first time, get 'numJokesToGet' number of jokes (10) by calling getJokes function
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }
  // after component re-renders or state changes, get 'numJokesToGet' number of jokes (10) by calling getJokes function
  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  // retrieve jokes from API. load jokes one at a time, adding not-yet-seen jokes to 'jokes' array
  async getJokes() {
    try {
      // redefine piece of state 'jokes' (this.state.jokes) to variable 'jokes' since any piece of state is immutable and we want to add jokes to the jokes array 
      let jokes = this.state.jokes;
      
      // 'jokeVotes' is initialized to an empty object
      let jokeVotes = {};

      // 'seenJokes' is initialized to an empty array
      let seenJokes = [];
      
      // while the length of the 'jokes' array is less than the value of 'numJokesToGet' (10)(makes sure only 10 jokes are added to 'jokes' array), do the following:
      while (jokes.length < this.props.numJokesToGet) {
        // make an axios call to get a joke from the API in JSON
        let response = await axios.get("https://icanhazdadjoke.com", {
          // tell the API to get the joke in JSON
          headers: { Accept: "application/json" }
        });

        // destructure the 'joke' properties from response.data
        let { ...joke } = response.data;
        
        // for each iteration of the 'while' loop, if the 'seenJokes' array doesn't already include the joke.id in 'response.data' (prevents duplication), do the following:
        if (!seenJokes.includes(joke.id)) {

          // add 'joke.id' to 'seenJokes'.  (i.e. after all 'numJokesToGet' (10) iterations, seenJokes = [0LuXvkq4Muc, 8hVnbxcp4wc, D5E6USfNmb, IexXD5TnGBd, W8MClVvXSf, fNZTCdFBImb, i39hqWnGljb, q4hiGJBXLe, vPmy5EtPKuc, xs4o49hF6pb])
          seenJokes.push(joke.id);
        
          // for key=joke.id, set the value (jokeVotes[joke.id]) equal to whatever the key's value is or 0 if it's undefined.  (i.e. after all 'numJokesToGet' (10) iterations, jokeVotes = {0LuXvkq4Muc:0, 8hVnbxcp4wc:0, D5E6USfNmb:0, IexXD5TnGBd:0, W8MClVvXSf:0, fNZTCdFBImb:0, i39hqWnGljb:0, q4hiGJBXLe:0, vPmy5EtPKuc:0, xs4o49hF6pb:0})
          jokeVotes[joke.id] = jokeVotes[joke.id] || 0;

          // add each joke object (including key:value pairs 'id', 'joke' and 'status') returned from the axios call to the 'jokes' array along with the key:value pair 'votes: jokeVotes[joke.id]'. 
          // (i.e after 'numJokesToGet' (10) iterations with no up-votes or down-votes, 
          // jokesInState = [
          // {id: '0LuXvkq4Muc', joke: 'As I suspected, someone has been adding soil to my garden. The plot thickens.', status=200, votes: 0}, 
          // {id: '8hVnbxcp4wc', joke: 'What do you call cheese by itself? Provolone.', status=200, votes: 0},
          // {id: 'D5E6USfNmb', joke: `"I'm sorry." "Hi sorry, I'm dad"`, status=200, votes: 0},
          // {id: 'IexXD5TnGBd', joke: 'To the guy who invented zero... thanks for nothing.', status=200, votes: 0}, 
          //   {id: 'W8MClVvXSf', joke: "Ben & Jerry's really need to improve their operati…. The only way to get there is down a rocky road.", status=200, votes: 0},
          //   {id: 'fNZTCdFBImb', joke: 'Why was ten scared of seven? Because seven ate nine.', status=200, votes: 0},
          //   {id: 'i39hqWnGljb', joke: 'So, I heard this pun about cows, but it’s kinda of…t. I don’t want there to be any beef between us. ', status=200, votes: 0},
          //   {id: 'q4hiGJBXLe', joke: 'What did the late tomato say to the early tomato? I’ll ketch up', status=200, votes: 0}, 
          //   {id: 'vPmy5EtPKuc', joke: "I met this girl on a dating site and, I don't know, we just clicked.", status=200, votes: 0},
          //   {id: 'xs4o49hF6pb', joke: "What's the difference between a hippo and a zippo?…e is really heavy, the other is a little lighter.", status=200, votes: 0}
          // ])
          jokes.push({ ...joke, votes: jokeVotes[joke.id]});

        } else {
          // if the 'seenJokes' array already includes the joke.id in 'response.data', don't do anything besides send a message
          console.log("duplicate found!");
        }
      }
      // After completing all iterations and all (10) jokes have been added to 'jokes', set the piece of state 'this.state' (in the constructor) equal to the 'jokes' array 
      this.setState({ jokes });
      
    } catch (error) {
      console.log(error);
    }
    
  }

  /* function to be used in 'Joke' component that changes vote by 'delta' (+1 or -1) for the joke with id passed in  */
  vote(id, delta) {
    // initialize 'jokeVotes' to an empty object
    let jokeVotes = {};

    // for the key in jokeVotes (jokeVotes[id] => the id of the joke being up-voted or down-voted), set its value to what jokeVotes[id] equals (or 0 if undefined) + delta (+1 or -1). (i.e. after clicking up-vote once, jokeVotes = {0LuXvkq4Muc: 1})
    jokeVotes[id] = (jokeVotes[id] || 0) + delta;
   
    // set piece of state 'jokes' by mapping over 'jokes' array (state.jokes). For every joke object in the array, if the joke.id of that object matches the id of the joke either up-voted or down-voted, create a new array with all the properties of 'joke' and add the key:value pair 'votes: (joke.votes + delta)' to the joke object. This will increment or decrement 'joke.votes'. If the ids don't match then just leave the joke array as isin state
    this.setState(state => ({
      jokes: state.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    }));
  
  }
  
  /* render:  list of jokes. */

  render() {
    return (
      <div className="JokeList">
        {/* map over piece of state 'jokes' array (this.state.jokes) and for every joke, render the 'Joke' component with the text of the joke, key, id and votes props passed in as well as the 'vote' function  */}
        {this.state.jokes.map(joke => (
          <Joke
            text={joke.joke}
            key={joke.id}
            id={joke.id}
            votes={joke.votes}
            vote={this.vote} 
          />
        ))}
      </div>
    );
  }
}

// Set default value for props
JokeList.defaultProps = {
  numJokesToGet: 10
};

export default JokeList;



// function JokeList({ numJokesToGet = 10 }) {
//   const [jokes, setJokes] = useState([]);

//   /* get jokes if there are no jokes */

//   useEffect(function() {
//     async function getJokes() {
//       let j = [...jokes];
//       let seenJokes = new Set();
//       try {
//         while (j.length < numJokesToGet) {
//           let res = await axios.get("https://icanhazdadjoke.com", {
//             headers: { Accept: "application/json" }
//           });
//           let { status, ...jokeObj } = res.data;
  
//           if (!seenJokes.has(jokeObj.id)) {
//             seenJokes.add(jokeObj.id);
//             j.push({ ...jokeObj, votes: 0 });
//           } else {
//             console.error("duplicate found!");
//           }
//         }
//         setJokes(j);
//       } catch (e) {
//         console.log(e);
//       }
//     }

//     if (jokes.length === 0) getJokes();
//   }, [jokes, numJokesToGet]);

//   /* empty joke list and then call getJokes */

//   function generateNewJokes() {
//     setJokes([]);
//   }

//   /* change vote for this id by delta (+1 or -1) */

//   function vote(id, delta) {
//     setJokes(allJokes =>
//       allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
//     );
//   }

//   /* render: either loading spinner or list of sorted jokes. */

//   if (jokes.length) {
//     let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  
//     return (
//       <div className="JokeList">
//         <button className="JokeList-getmore" onClick={generateNewJokes}>
//           Get New Jokes
//         </button>
  
//         {sortedJokes.map(j => (
//           <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
//         ))}
//       </div>
//     );
//   }

//   return null;

// }

// export default JokeList;
