import React from "react";
import "./Joke.css";


class Joke extends React.Component {

  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
  }

  // function that calls the 'vote' function in the 'JokeList' component with the id of the joke being up-voted (this.props.id') as well as the increment value (+1) being passed in.

  // The 'vote' function takes the value assigned to the key (the id of the joke being up-voted) and adds one to it. 
  upVote() {
    this.props.vote(this.props.id, +1);
  }

  // function that calls the 'vote' function in the 'JokeList' component with the id of the joke being down-voted (this.props.id') as well as the decrement value (-1) being passed in.

  // The 'vote' function takes the value assigned to the key (the id of the joke being up-voted) and subtracts one from it. 
  downVote() {
    this.props.vote(this.props.id, -1);
  }

  render() {
    return (
      <div className="Joke">
        <div className="Joke-votearea">
          {/* when click on the thumbs-up character, execute the upVote function */}
          <button onClick={this.upVote}>
            {/*display a thumbs-up character as the upVote buttton  */}
            <i className="fas fa-thumbs-up" />
          </button>

          {/* when click on the thumbs-down character, execute the downVote function */}
          <button onClick={this.downVote}>
            {/*display a thumbs-down character as the downVote buttton  */}
            <i className="fas fa-thumbs-down" />
          </button>

          {/* display the number of votes this joke has */}
          {this.props.votes}
        </div>
        
        {/* display the text of this joke */}
        <div className="Joke-text">{this.props.text}</div>
      </div>
    )
  }

}

export default Joke;



// function Joke({ vote, votes, text, id }) {
//   const upVote = () => vote(id, +1);
//   const downVote = () => vote(id, -1);

//   return (
//     <div className="Joke">
//       <div className="Joke-votearea">
//         <button onClick={upVote}>
//           <i className="fas fa-thumbs-up" />
//         </button>

//         <button onClick={downVote}>
//           <i className="fas fa-thumbs-down" />
//         </button>

//         {votes}
//       </div>

//       <div className="Joke-text">{text}</div>
//     </div>
//   );
// }

// export default Joke;
