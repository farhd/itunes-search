import React, { Component } from 'react';
import itunes from 'searchitunes';
import { 
  Container, Row, Col, 
  Navbar,
  InputGroup, InputGroupAddon, InputGroupText, Input,
  Button,
  Card, CardImg, CardText, CardBody, CardTitle,
} from 'reactstrap';
import { debounce } from 'lodash';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ResultCard from './ResultCard';

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
    this.setState({suggestions: []});
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
    
  }

  onSuggestionSelect(e) {
    let newVal = e.target.id;
    this.setState({term: newVal}, () => {
      this.search();
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar>
          <Container className="search">
            <InputGroup>
              <Input value={this.state.term} onChange={this.onTermChange} placeholder="Movie title..." />
              <InputGroupAddon addonType="append">
                <Button color="info" onClick={this.search}>Search</Button>
              </InputGroupAddon>
            </InputGroup>
            <div className="search__suggest">
              {this.state.suggestions.map((item, i) => {
                return <div id={item.trackName} key={i} onClick={this.onSuggestionSelect}>{item.trackName}</div>
              })}
            </div>
          </Container>
        </Navbar>
        
        <div className="search__results">
          <Container>
            <Row>
              {this.state.results.map((item, i) => {
                return (
                  <ResultCard key={i}
                    imgsrc={item.artworkUrl100} 
                    title={item.trackName} 
                    subtitle={item.artistName}
                    desc={item.shortDescription ? item.shortDescription : item.longDescription}
                    onPreview={this.onPreview}
                    previewUrl={item.previewUrl}
                  />
                )
              })}
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
