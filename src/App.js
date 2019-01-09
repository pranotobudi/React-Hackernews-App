import React, { Component } from 'react';
import './App.css';



const list = [
  {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
  },
  {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clarkkkk',
  num_comments: 2,
  points: 5,
  objectID: 1,
  },
];

class Excel extends Component{
  constructor(props) {
    super(props);
    this.state = {
      headers: this.props.headers,
      data: this.props.data,
      sortby: 0,
      ascending: true
    };
    this.onHandleClick = this.onHandleClick.bind(this);

  }

  onHandleClick(param, e){
    var columnClicked = e.target.cellIndex;
    //var column = e.target;
    let data = this.state.data
    let current_ascending = this.state.ascending
    if(this.state.sortby === columnClicked){
      current_ascending = !this.state.ascending
    }else{
      current_ascending=true
    }

    data.sort(
      function(a,b){
        // console.log("type a:"+typeof(a)+" type b: "+typeof(b))
        // console.log("a: "+a+" b: "+b)
        return current_ascending?(a[columnClicked] > b[columnClicked]): (a[columnClicked] < b[columnClicked])
      }
    );
    
    let headers = this.state.headers;
    console.log("header before: "+headers);
    let new_headers = headers.map(
      (item, idx) => {
        //clean up first
        item = item.replace('\u2191','');
        item = item.replace('\u2193','');

          if (columnClicked === idx){
          item += current_ascending?' \u2191':' \u2193'; 
          }
        console.log(item + " idx: " + idx)
        return item;
      }
    );

    console.log("header after: "+new_headers);
    this.setState(
      {
        headers: new_headers,
        data: data, 
        sortby: columnClicked,
        ascending: current_ascending,
      }
    );


    
    // this.setState({headers: ["book"]})
    // console.log("clicked"+column+" event: "+e+" param: "+param);
  }
  componentDidMount() {
    console.log('I was triggered during componentDidMount')
  }
  render(){
    console.log('I was triggered during render')
    return(
      <table>
        {/* <thead onClick={this.onHandleClick}> */}
        <thead onClick={this.onHandleClick.bind(this, 'Parameter')}>
          <tr >
            {console.log(this.state.headers)}
            {
                this.state.headers.map((item) => {
                return(
                  <th key={item.toString()} >
                      {item}
                  </th>        
                );
              })
            }
          </tr>
        </thead>
        <tbody>
          {
              this.state.data.map((item) => {
                  return(
                    <tr key={item.toString()} >
                      <td>{item[0]}</td>
                      <td>{item[1]}</td>
                      <td>{item[2]}</td>
                      <td>{item[3]}</td>
                      <td>{item[4]}</td>
                    </tr>
                  );
              })
          }

        </tbody>
      </table>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: list,
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  onDismiss(id) {
    function isNotId(item) {
      return item.objectID !== id;
    }
      
    const updatedList = this.state.list.filter(isNotId); //input argument of filter is a function. 
    this.setState({ list: updatedList });
  }
    
      
  render() {
    return (
      <div className="App">
        Bismillah
        Alhamdulillah
        {this.state.list.map(function(item) {
          return (
            <div key={item.objectID}>
              <span><a href={item.url}>{item.title}</a></span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <button
                  onClick={() => this.onDismiss(item.objectID)}
                  type="button"
                  >
                  Dismiss
                </button>
              </span>
            </div>
          );
        })}

      </div>
    );
  }
}

// export default App;
export default Excel;
