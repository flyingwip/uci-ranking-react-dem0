var ListHeader = React.createClass({

  //toggle value asc , desc
  getInitialState: function() {

    return {order: 'ti-angle-up',active:'rank'};
  },

  handleClick: function (column) {
    
    this.state.active = column;

    if(this.state.order=='ti-angle-up'){
      this.setState({order: 'ti-angle-down'});
    } else {
      this.setState({order: 'ti-angle-up'});
    }

    //reverse the list
    this.props.onUserInput();

  },

  render: function() {
    return (
      <li className="cyclist">
        <ul className="">
          <li className={this.state.active=='rank' ? 'active':'inactive'} onClick={this.handleClick.bind(null, "rank")}>RANG <span className={this.state.order} ></span><span className="ti-arrows-vertical" ></span></li>
          <li >KOMT VAN</li>
          <li >&nbsp;</li>
          <li>NAAM</li>
          <li className={this.state.active=='country' ? 'active':'inactive'} onClick={this.handleClick.bind(null, "country")}>NATIONALITEIT <span className={this.state.order} ></span><span className="ti-arrows-vertical" ></span></li>
          <li className={this.state.active=='team' ? 'active':'inactive'} onClick={this.handleClick.bind(null, "team")}>TEAM <span className={this.state.order} ></span><span className="ti-arrows-vertical" ></span></li>
          <li>PUNTEN</li>
        </ul>  
      </li>
    );
  }
});


var Cyclist = React.createClass({


  render: function() {

    var arrow = ''; 

    if(this.props.cyclist[0]>this.props.cyclist[1]){
      arrow = 'ti-angle-double-up';       
    } else if (this.props.cyclist[0]<this.props.cyclist[1]){
      arrow = 'ti-angle-double-down'; 
    } else {
      arrow = 'dash';
    }

    return (
      <li className="cyclist">
        <ul className="">
          <li>{this.props.cyclist[0]}.</li>
          <li>{this.props.cyclist[1]} </li>
          <li><span className={arrow}></span></li>
          <li>{this.props.cyclist[2]}</li>
          <li className={this.props.cyclist[3].toLowerCase()+ ' country'} >&nbsp;</li>
          <li>{this.props.cyclist[4]}</li>
          <li>{this.props.cyclist[6]}</li>
        </ul>  
      </li>
    );
  }
});




var CyclistsList = React.createClass({

  //toggle value asc , desc
  getInitialState: function() {
    return {order: 'ASC'};
  },


  handleUserInput: function (filterText, tata) {

    var column = 0;
    var order = 'ti-angle-up';

    //first set the order
    (this.refs.listheader.state.order=='ti-angle-up') ? order = 'down' : order = 'up';

    if(this.refs.listheader.state.active=='country'){
      column = 3;
    }
    if(this.refs.listheader.state.active=='team'){
      column = 4;
    }
    (column>0) ? this.props.data.sort(compareColumnByNr(column,order)) : this.props.data.sort(compareColumnByValue(column,order));
    
    (this.state.order=='ASC') ? this.setState({order: 'DESC'}) : this.setState({order: 'ASC'});
    
  },
  render: function() {

    var rows = [];
    //fixed menu always on top
    
    rows.push(<ListHeader onUserInput={this.handleUserInput } ref="listheader"  key="x"/>)
    
    this.props.data.forEach(function (cyclist) {

      if (cyclist[this.props.filterColumn].toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
      //if (cyclist[2].toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {  
      //if (cyclist[3].toLowerCase().indexOf('netherlands') === -1) {    
        return;
      }
      rows.push(<Cyclist cyclist={cyclist} key={cyclist[0]} />);
    }.bind(this));

    return (
      <ul className="cyclists">
        {rows}
      </ul>
    );
  }
  

});




var Logo = React.createClass({

  render: function() {
    return (
      <div className="logo">
        <img src="images/ranking_logo@0,5x.jpg" />
        <h1>unofficial ranking of CC </h1>
      </div>
    );
  }
});



var Search = React.createClass({

    getInitialState: function() {
    return {textInput: ''};
  },

  handleChange: function (e) {

    this.setState({textInput:e.target.value});
    this.props.onUserInput(e.target.value);
    //reset the filters
    this.refs.countrySelect.resetFilters();
    this.refs.teamSelect.resetFilters();
    
  },

  countryChange: function (countryFilter) {
    this.setState({textInput:''});
    this.refs.teamSelect.resetFilters();
    this.props.onCountryInput(countryFilter,3);
  },

  teamChange: function (teamFilter) {
    this.setState({textInput:''});
    this.refs.countrySelect.resetFilters();
    this.props.onCountryInput(teamFilter,4);
  },


  render: function() {
    
    return  (
      <div className="search">
        
        <div >
          <input type="text" placeholder="Zoek op naam.." value={this.state.textInput} onChange={this.handleChange} />
        </div>
        <div >
          <CountrySelect data={this.props.data} onCountryInput={this.countryChange} ref={'countrySelect' } />
        </div>
        <div >
          <TeamSelect data={this.props.data} onTeamInput={this.teamChange} ref={'teamSelect' } />
        </div>

      </div>
    );
  }
});


var CountrySelect = React.createClass({

  getInitialState: function() {
    return {data: [], options:'', optionsState:''};
  },

  countryChange: function (e) {
    
    this.setState({optionsState: e.target.value});
    this.props.onCountryInput(e.target.value);

  },

  resetFilters:function(){
    //
    this.setState({optionsState: ''});
  },

  render: function() {
    
      var countries = [];  
      var filtered=[];
      var counter = 0; 
      
      //we have to make sure each country appears only once so filter duplicates
      this.props.data.forEach(function (cyclist) {
        if(filtered.indexOf(cyclist[3])==-1){
          filtered.push(cyclist[3]);
        }
        
      }.bind(this));
      //alpabatically
      filtered.sort()
      
      //create the options
      for(var i = 0; i<filtered.length; i++ ){
          countries.push (<option value={filtered[i]} key={i}  >{filtered[i]}</option>);
      }

    return  (
          <select value={this.state.optionsState} className="styled-select" onChange={this.countryChange} >
            <option value="">Filter op land</option>
              {countries}
          </select>
    );      
  }  
});

var TeamSelect = React.createClass({

  getInitialState: function() {
    return {data: [], options:'', optionsTeam:''};
  },

  teamChange: function (e) {
    
    this.setState({optionsTeam: e.target.value});
    this.props.onTeamInput(e.target.value);

  },

  resetFilters:function(){
    //
    this.setState({optionsTeam: ''});
  },

  render: function() {
    
      var teams = [];  
      var filtered=[];
      var counter = 0; 
      
      //we have to make sure each country appears only once so filter duplicates
      this.props.data.forEach(function (cyclist) {
        if(filtered.indexOf(cyclist[4])==-1){
          filtered.push(cyclist[4]);
        }
        
      }.bind(this));
      //alpabatically
      filtered.sort()
      
      //create the options
      for(var i = 0; i<filtered.length; i++ ){
          teams.push (<option value={filtered[i]} key={i}  >{filtered[i]}</option>);
      }

    return  (
          <select value={this.state.optionsTeam} className="styled-select" onChange={this.teamChange} >
            <option value="">Filter op team</option>
              {teams}
          </select>
    );      
  }  
});  


var UCIRanking = React.createClass({

    getInitialState: function() {
    return {data: [], filterText:'',filterColumn:2};
  },


  loadRankingssFromServer: function() {
    
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: true,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        //console.log(err.toString());
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    this.loadRankingssFromServer();
  },
  
handleUserInput: function (filterText) {
    
    this.setState({filterColumn: 2});
    this.setState({filterText: filterText});

  },  

handleCountryInput: function (counryFilter,filterColumn) {
    
    this.setState({filterText: ''});
    this.setState({filterColumn: filterColumn});
    this.setState({filterText: counryFilter});
    
  },  



  render: function() {


    return (
      <div className="rankingBox">
        <Logo/>
        <div className="border-box">  
          <Search data={this.state.data} onUserInput={this.handleUserInput} onCountryInput={this.handleCountryInput}  />
          <CyclistsList data={this.state.data} filterText={this.state.filterText}  filterColumn={this.state.filterColumn}  />
        </div>  
      </div>
    );
  }
});




ReactDOM.render(
  <UCIRanking url="ranking.php" />,
  document.getElementById('content')
);