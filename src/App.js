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
      ascending: true,
      edit: {row:null, col:null},
      isSearch: false,
    };
    this.preSearchData = null;
    this.onHandleClickSort = this.onHandleClickSort.bind(this);
    this.handleDoubleClickEdit=this.handleDoubleClickEdit.bind(this);
    this.handleSubmitSave = this.handleSubmitSave.bind(this);
    this.handleOnChangeSearch = this.handleOnChangeSearch.bind(this);
    this.handleOnClickSearch = this.handleOnClickSearch.bind(this);
    this.handleOnClickDownload = this.handleOnClickDownload.bind(this, 'json');
  }

  onHandleClickSort(e){
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
          item += current_ascending?' \u2193':' \u2191'; 
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
  }

  handleDoubleClickEdit(e){
    let row = parseInt(e.target.dataset.row, 10);
    let col = parseInt(e.target.dataset.column, 10);
    console.log("e.target:"+e.target)
    console.log("e.target.dataset:"+e.target.dataset)
    console.log("e.target.dataset.row:"+e.target.dataset.row + " type: " + typeof(e.target.dataset.row))
    console.log("e.target.dataset.column:"+e.target.dataset.column +" type: "+ typeof(e.target.dataset.column))
    console.log("content: "+this.state.data[row][col])
    console.log("innerText: "+e.target.innerText)
    console.log("textContent: "+e.target.textContent)
    // e.target.textContent = 
    //   <form>
    //     <input type='text'>{e.target.innerText}</input>
    //   </form>;
    this.setState(
      {
        edit:{
          row:row,
          col:col
        }
      }
    );
  }

  handleSubmitSave(e){
    e.preventDefault();
    console.log("FirstChild Value: "+e.target.firstChild.value)
    // console.log("innerText: "+e.target.innerText)
    // console.log("textContent: "+e.target.textContent)
    let new_data = this.state.data;
    new_data[this.state.edit.row][this.state.edit.col] = e.target.firstChild.value;
    this.setState({      
        data: new_data,
        edit:{row:null, col:null}
      });
  }

  handleOnChangeSearch(e){
    
    let searchText = e.target.value.toLowerCase();
    let cellIdx = e.target.dataset.idx;
    // console.log("cellIdx: "+cellIdx);
    console.log("searchText:" + searchText);
    console.log("preSearchData:" + this.preSearchData);
    let searchResultData = this.preSearchData.filter((dataInRow) => {
      // console.log("dataInRow: "+dataInRow);
      // console.log("dataInRow[cellIdx]: "+dataInRow[cellIdx]);
      console.log(dataInRow[cellIdx].toLowerCase().includes(searchText));
      return dataInRow[cellIdx].toLowerCase().includes(searchText);
    });
    this.setState(
      {data: searchResultData}
    );
  }

  handleOnClickSearch(e){
    if(this.state.isSearch){
      /* search button clicked: on to off */
      this.setState({isSearch:false});
    }else{
      this.setState({isSearch:true});
      this.preSearchData = this.state.data;
    }

  }

  handleOnClickDownload(format, e){ 
    console.log('test')
    // let contents = JSON.stringify(this.state.data);
    // let URL = window.URL || window.webkitURL;
    // let blob = new Blob([contents], {type: 'text/' + format});
    // e.target.href = URL.createObjectURL(blob);
    // e.target.download = 'data.' + format;

    let filename = "export.json";
    let contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(this.state.data)))], { type: contentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    }else {
      var a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(this.state.data));
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
 

  }

  componentDidMount() {
    console.log('I was triggered during componentDidMount')
  }

  renderToolbar(){
    return(
      <div>
      <button onClick={this.handleOnClickSearch}>Search</button>
      <button onClick={this.handleOnClickDownload}>Download JSON</button>
      </div>
      
    );
  }

  renderSearch(){
    if(!this.state.isSearch){
      return null;
    }
    return(
      <tr>
        {
          this.state.headers.map((_notUsed,idx) => {
            return(
              <td key={idx}>
                <input data-idx={idx} onChange={this.handleOnChangeSearch}/>
              </td>
            );
          })
        }        
      </tr>
    );
  }

  renderContent(){
    return(
        this.state.data.map((row, rowIdx) => {     
          return(
            <tr key={row.toString()} >
              {
                row.map((item, colIdx) => {
                  let isEdit = (this.state.edit.row === rowIdx) && (this.state.edit.col === colIdx);
                  return(
                    <td key={colIdx} data-column={colIdx} data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>
                      {isEdit?(
                          <form onSubmit={this.handleSubmitSave}>
                            <input type="text" defaultValue={item}/>
                          </form>
                        ):(
                          item
                        )
                      }
                    </td>
                  );
                })
              }
              
              
                {/* <td data-column='0' data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>{row[0]}</td>
                <td data-column='1' data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>{row[1]}</td>
                <td data-column='2' data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>{row[2]}</td>
                <td data-column='3' data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>{row[3]}</td>
                <td data-column='4' data-row={rowIdx} onDoubleClick={this.handleDoubleClickEdit}>{row[4]}</td>  */}
              
            
            </tr>
          );
      })        
      
    );
  }

  renderTable(){
    return(
      <table>
      <thead onClick={this.onHandleClickSort}>
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
        {this.renderSearch()}
        {this.renderContent()}
      </tbody>
    </table>
    );
  }

  render(){
    console.log('I was triggered during render')
    return(
      <div>
        {this.renderToolbar()}
        {this.renderTable()}
      </div>
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
