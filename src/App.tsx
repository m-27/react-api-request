/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState }from 'react';
import './css/App.less';
import Select from './js/component/Select';


interface FoodState {
  data : any[],
  citySelected: string,
  town: any[],
  townSeleted: string,
  foodData: any[], 
  isLoading: boolean
}

class App extends React.Component<{}, FoodState> {
  constructor(props:any){
    super(props);
    this.state = {
      data: [],
      citySelected : "",
      town: [],
      townSeleted: "",
      foodData: [],
      isLoading: true
    };
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleTownChange = this.handleTownChange.bind(this);
  }
  

  // 選擇行政區域
  handleCityChange(event: { City: any; }){
    let updateTxt = event? event.City: "";
    this.setState({
      citySelected: updateTxt, 
      townSeleted: ""
    });
    this.updateTown(updateTxt);
  }

  // 更新鄉鎮區域
  updateTown(value:string){
    let data = this.state.data;
    var filteredObject = Object.keys(data).reduce(function(r:any, e:any) {
      if (value.includes(data[e].City)) r[e] = data[e]
      return r;
    }, {})
    let town = Object.values(filteredObject);
    let chkData = town.length === 0 ? data: town;
    this.setState({
      town: town,
      foodData: chkData
    });
  }

  // 選擇鄉鎮區域
  handleTownChange(event: { Town: any; }){
    let val = event? event.Town: "";
    let town = val.length === 0 ? this.state.citySelected.length === 0 ? this.state.data : this.state.town  : this.state.town.filter((elem: any) => elem.Town === val);
    this.setState({
      townSeleted: val, 
      foodData: town
    });
  }

  componentDidMount(){

    let that = this;

    if(localStorage.getItem("travelFoodList") === null){
      const cors = 'https://cors-anywhere.herokuapp.com/'; // use cors-anywhere to fetch api data
      const url = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx'; // origin api url
      fetch(`${cors}${url}`)
      .then(response => response.json())
      .then(function(jsonStr) {
        that.setState({ 
          data: jsonStr, 
          foodData: jsonStr,
          isLoading: false
        });
        localStorage.setItem("travelFoodList", JSON.stringify(jsonStr));
      });
    }else{
      const jsonStr = localStorage.getItem("travelFoodList") as any;
      that.setState({ 
        data: JSON.parse(jsonStr), 
        foodData: JSON.parse(jsonStr),
        isLoading: false
      });
    }
  }
  render() {
    let { data, town, foodData, citySelected, townSeleted, isLoading} = this.state;
    const newCity = data.filter((elem: { City: any; }, index: any, self: any[]) => 
      self.findIndex((t: { City: any; }) => {return t.City === elem.City }) === index);

    const newTown = town.filter((elem: { Town: any; }, index: any, self: any[]) => 
      self.findIndex((t: { Town: any; }) => {return t.Town === elem.Town }) === index);

    let loadingElem = isLoading ? 
      <div className="loader-wrap"><div className="loader"></div></div>:
      <div className={`items-wrapper`}>
        {foodData.map((elem: any, i: any)=>
          <div key={i} className="item">
            <div className="items-mask"></div>
            <img src={`${elem.PicURL}`} alt={`${elem.Name}`}/>
            <div className="city">{elem.City}</div>
            <div className="food-info">
              <div className="town">{elem.Town}</div>
              <div className="name">{elem.Name}</div>
              <div className="hostWords">
                <hr/>
                {elem.HostWords}
              </div>
            </div>
          </div>
        )}
      </div> as JSX.Element;

    return (
      <div id="wrapper">
        <h1 id="title">農村地方美食小吃特色料理</h1>
        <div className="select-fields">
          <fieldset className="fields">
            <Select list={newCity} handleChange={this.handleCityChange} defaultValue={`請選擇行政區域...`} flag={0} selected={citySelected}/>
            <Select list={newTown} handleChange={this.handleTownChange} defaultValue={`請選擇鄉鎮區...`} flag={1} selected={townSeleted}/>
          </fieldset>
        </div>
        <div id="Container">
          <div className="items-container">
            {loadingElem}
          </div>
        </div>
      </div>
    )
  }
}

export default App;