import React, { Component } from 'react';
import itunes from 'searchitunes';
import { debounce } from 'lodash';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      term: '',
      opts: {
        entity: 'movie',
        country: 'DE',
        limit: 50,
      },
      results: [],
      suggestions: []
    }

    this.search = this.search.bind(this);
    this.onTermChange = this.onTermChange.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onSuggestionSelect = this.onSuggestionSelect.bind(this);
  }

  search() {
    let opts = Object.assign({}, this.state.opts, {term: this.state.term});
    console.log(`Search params: ${JSON.stringify(opts)}`)
    itunes(opts)
      .then(resp => {
        this.setState({results: resp.results});
      })
      .catch(() => {
        this.setState({results: []});
      });
  }

  onTermChange(e) {
    const newVal = e.target.value;
    this.setState({term: newVal}, () => {
      let opts = Object.assign({}, this.state.opts, {
        term: this.state.term,
        limit: 10
      });
      console.log(`Search params: ${JSON.stringify(opts)}`)
      itunes(opts)
        .then(resp => {
          this.setState({suggestions: resp.results});
        })
        .catch(() => {
          this.setState({suggestions: []});
        });
    });
  }

  onPreview(e) {
    let vid = e.target;
    console.log(vid.networkState, vid.readyState)
  }

  onSuggestionSelect(e) {
    let newVal = e.target.id;
    this.setState({term: newVal, suggestions: []}, () => {
      this.search();
    });
  }

  render() {
    return (
      <div className="App">
        <div>
          <input type="search" value={this.state.term} onChange={this.onTermChange} />
          <button onClick={this.search} >Search</button>
          <div className="search__suggest">
            {this.state.suggestions.map((item, i) => {
              return <div id={item.trackName} key={i} onClick={this.onSuggestionSelect}>{item.trackName}</div>
            })}
          </div>
        </div>
        <div className="search__results">
          {this.state.results.map((item, i) => {
            return (
              <div key={i} onClick={this.onPreview}>
                <img src={item.artworkUrl100} alt="artwork"/> 
                {item.trackName} - {item.artistName}
                <video src={item.previewUrl} preload="metadata" onClick={this.onPreview}></video>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default App;
