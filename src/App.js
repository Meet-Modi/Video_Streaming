import React from 'react';
import './App.css';
import Sidebar from "./Components/Sidebar";
import MainSection from "./Components/MainSection";
import Lazyloader from "./Components/Lazyloader";
//import movies from "./Movies.js";
//import { getHomePage } from "./api/api.js"
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

var movies = [];
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoading: true,
      items: [],
      fetched: false
    }
  }

  componentDidMount() {
    axios.get("http://35.226.140.212/api/search/explore").then(
      result => {
        let movies = [];
        result.data.forEach(element => {
          element.cover = element.id;
          //console.log(element.cover);
          element.title = element.name;
          element.watched = false;
          element.inPlaylist = false;
          element.favorite = true;
          element.link = "http://35.226.140.212/api/video/" + element.id;
          movies.push(element);
        })

        this.setState({
          items: movies,
          fetched: true
        });
        console.log(this.state.items);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      error => {
        this.setState({
          isLoading: false,
          error
        });
      }
    );

    setTimeout(() => {
      this.setState({
        isLoading: false,
        fetched: false
      })
    }, 2000);

  }

  render() {

    if (this.state.isLoading) {
      return (
        <Lazyloader />
      )
    } else {

      // if (this.state.items) {
      //   this.state.items.forEach(element => {
      //     element.cover = element.id;
      //     //console.log(element.cover);
      //     element.title = element.name;
      //     element.watched = false;
      //     element.inPlaylist = false;
      //     element.favorite = true;
      //     element.link = "http://35.192.24.74/api/video/" + element.id;
      //     movies.push(element);
      //   });
      // }
      return (
        <div>

          <Sidebar
            items={
              [
                {
                  link: '#',
                  title: 'Explore',
                  icon: 'fas fa-search'
                }, {
                  link: '#',
                  title: 'Watch List',
                  icon: 'fas fa-save'
                }, {
                  link: '#',
                  title: 'Favorites',
                  icon: 'fas fa-heart'
                }
              ]
            }
          />
          <MainSection
            movies={this.state.items}
          />

        </div>
      );
    }

  }
}

export default App;