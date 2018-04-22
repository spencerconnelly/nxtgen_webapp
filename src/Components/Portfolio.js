import React, { Component, button} from 'react';
import Modal from 'react-modal';
import './styles.css';


class Portfolio extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      wallet: {},
      walletData: {},
      walletDataDisplay: {},
      imageURLS: {},
      coinQuantities: [],
      usBalance: 0.00,
      percentChange: 0.000,
      coinQuantity: 0,
      showModal: false,
      showBuyModal: true,
      buyValue: 'BTC',
      sellValue: '',
    };

    this.fetchData=this.fetchData.bind(this);
    this.getInitialState=this.getInitialState.bind(this);
    this.updateBalance=this.updateBalance.bind(this);
    this.updatePercentChange=this.updatePercentChange.bind(this);
    this.openBuyModal=this.openBuyModal.bind(this);
    this.openSellModal=this.openSellModal.bind(this);
    this.closeModal=this.closeModal.bind(this);
    this.handleBuyChange=this.handleBuyChange.bind(this);
    this.handleSellChange=this.handleSellChange.bind(this);
    this.handleAddSubmit=this.handleAddSubmit.bind(this);
    this.handleSellSubmit=this.handleSellSubmit.bind(this);
    this.handleInputChange=this.handleInputChange.bind(this);
  }

  fetchData(){
    const url = "https://min-api.cryptocompare.com/data/";
    var walletSymbols = [];
    Object.keys(this.state.wallet).map((key)=>{
        walletSymbols.push(key);
      });
    walletSymbols=this.arrayToString(walletSymbols,',');
    if(walletSymbols.length != 0){
      fetch(url+"pricemultifull?fsyms="+walletSymbols+"&tsyms=USD")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            walletData: result.RAW,
            walletDataDisplay: result.DISPLAY
          }, () => {
            this.updateBalance();
          });
        })
      .then(
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

      fetch(url+"coin/generalinfo?fsyms="+walletSymbols+"&tsym=USD")
      .then(res => res.json())
      .then(
        (result) => {
          var images = {};
          var i = 0;
          Object.keys(this.state.wallet).map((key) => {
            images = Object.assign({}, images, {[key]: result.Data[i].CoinInfo.ImageUrl});
            i++;
          });
          this.setState({
            imageURLS: images
          });
        })
      .then(
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );

    } else {
      console.log('never here');
      this.setState({
            walletData: {},
            walletDataDisplay: {}
          }, () => {
            this.updateBalance();
          });
    } 
  }

  //Helper function to turn array of strings, s, to a string segregated by d  
  //Helps fetch the data from the api
  arrayToString(s, d){
    var x = '';
    Object.keys(s).map((key) => {
      if(x != ''){
        x = x + d + s[key];
      } else{
        x=s[key];
      }
      
    });
    return x;
  }

  getInitialState(s) {
    return JSON.parse(localStorage.getItem(s) || '{}');
  }

  handleAddSubmit(event){
    var val = this.state.buyValue;
    if(this.state.buyValue == "other") {
      val = this.state.otherVal.toUpperCase();
    }
    if(!(val in this.state.wallet)  &&  (this.state.coinQuantity > 0)){
      var newInput = Object.assign({}, this.state.wallet, {[val]: Number(this.state.coinQuantity)});
      this.setState({ wallet: newInput }, () => {
        this.fetchData();
        localStorage.setItem('myWallet', JSON.stringify(this.state.wallet));
      });
      this.setState({coinQuantity: 0});
      this.closeModal();
    } else if(this.state.coinQuantity <= 0) {
      alert("Please Enter a Value Greater than 0 for Coin Quantity");
    } else {
      const num = this.state.wallet[val] + Number(this.state.coinQuantity);
      this.state.wallet[val] = num ;
      this.fetchData();
      localStorage.setItem('myWallet', JSON.stringify(this.state.wallet));
      this.closeModal();
    }
    event.preventDefault();
  }

  handleSellSubmit(event) {
    if(this.state.sellValue in this.state.wallet && this.state.wallet[this.state.sellValue] >= this.state.coinQuantity && (this.state.coinQuantity > 0)){
      this.state.wallet[this.state.sellValue] = this.state.wallet[this.state.sellValue] - this.state.coinQuantity;
      this.fetchData();
      if(this.state.wallet[this.state.sellValue] == 0){
        const holder = this.state.wallet;
        const sym = this.state.sellValue;
        const index = Object.keys(holder).indexOf(sym);
        if (index !== -1) {
          delete holder[sym];
          this.setState({wallet: holder}, 
            this.fetchData
          );
          localStorage.setItem('myWallet', JSON.stringify(holder));
        }
      }
      this.closeModal();
    } else if(this.state.wallet[this.state.sellValue] < this.state.coinQuantity){
      alert("You do not have that many "+this.state.BuySym+" in your porfolio.");
    } else if(this.state.coinQuantity <= 0){
      alert("You must remove more than 0 from your porfolio");
    }
    event.preventDefault();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleBuyChange(event) {
    this.setState({buyValue:event.target.value});
  }

  handleSellChange(event) {
    this.setState({sellValue:event.target.value});
  }

  openBuyModal() {
    this.setState({showBuyModal: true});
    this.setState({showModal: true});
  }

  openSellModal() {
    this.setState({showBuyModal: false});
    this.setState({sellValue: Object.keys(this.state.wallet)[0]});
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({showModal: false, showBuyModal: false});
  }

  //called before entering "other"
  updateBalance() {
    var bal = 0;
    Object.keys(this.state.walletData).map((key)=>{
      bal += this.state.walletData[key].USD.PRICE * this.state.wallet[key];
    });
    this.setState({usBalance: bal}, () => {
      if(this.state.usBalance != 0)
        this.updatePercentChange(); 
      else
        this.setState({percentChange: 0.000});
    });

  }

  updatePercentChange() {
    var change24Hour = 0;
    Object.keys(this.state.walletData).map((key) => {
        change24Hour += this.state.walletData[key].USD.CHANGE24HOUR * this.state.wallet[key];
    });

    var newpercent = (change24Hour / this.state.usBalance)*100;
    this.setState({percentChange: newpercent});
  }

  componentDidMount() {
    localStorage.clear();
    const oldWallet =  JSON.parse(localStorage.getItem('myWallet'));
    if(oldWallet){
      this.setState({wallet: oldWallet, sellValue: Object.keys(oldWallet)[0]}, () => {
          this.fetchData();
      });
    }
    setInterval(this.fetchData,10000);
  }

  render() {
      const {showBuyModal} = this.state;
      return (
        <div class="container">
          <h1 class="balancetitle">Balance in USD: <br/>$ {Number(this.state.usBalance.toFixed(2)).toLocaleString()}</h1><br/>
          <h1 class="balancetitle">Percent Change in 24hrs:  <div class={this.state.percentChange > 0 ? "growth" : "loss"}>{(this.state.percentChange).toFixed(3)} %</div></h1><br/>
          <div class="container col-sm-12">
          <table class="table">
            <thead class="thead-inverse">
              <tr>
                <th scope="col">Avatar</th>
                <th scope="col">Symbol</th>
                <th scope="col">Holdings</th>
                <th scope="col">Price</th>
                <th scope="col">Holdings (USD)</th>
                <th scope="col">24hr High</th>
                <th scope="col">24hr Low</th>
                <th scope="col">Change % (24h)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.walletDataDisplay).map((key) => (
                <tr>
                  <td><img class="small-pic" src={"https://www.cryptocompare.com"+this.state.imageURLS[key]} alt="oops" /></td>
                  <th>{this.state.walletDataDisplay[key].USD.FROMSYMBOL}</th>
                  <td>{Number(this.state.wallet[key]).toFixed(8).toLocaleString()}</td>
                  <td>{this.state.walletDataDisplay[key].USD.PRICE}</td>
                  <td>$ {(Number((this.state.walletData[key].USD.PRICE * this.state.wallet[key]).toFixed(2))).toLocaleString()}</td>
                  <td>{this.state.walletDataDisplay[key].USD.HIGH24HOUR}</td>
                  <td>{this.state.walletDataDisplay[key].USD.LOW24HOUR}</td>
                  <td class={this.state.walletData[key].USD.CHANGEPCT24HOUR > 0 ? "growth" : "loss"}>{(this.state.walletData[key].USD.CHANGEPCT24HOUR).toFixed(3)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={this.openBuyModal} class="btn btn-primary port-button">Add Coin to Balance</button>
          <button onClick={this.openSellModal} class="btn btn-primary port-button">Remove Coin from Balance</button><br/>
          </div>
         <Modal className="coinmodal" isOpen={this.state.showModal} onRequestClose={this.closeModal} ariaHideApp={false}>
            <div class="modal-dialog">
              <div>
                {showBuyModal ? 
                  <form onSubmit={this.handleAddSubmit}>
                    <div class="form-group">
                      <label htmlFor="sel1">Select Coin:</label>
                      <select class="form-control" value={this.state.buyValue} onChange={this.handleBuyChange} ref="buyform">
                        <option value="BTC">Bitcoin - BTC</option>
                        <option value="ETH">Ether - ETH</option>
                        <option value="XRP">Ripple - XRP</option>
                        <option value="BCH">Bitcoin Cash - BCH</option>
                        <option value="LTC">Litecoin - LTC</option>
                        <option value="ADA">Cardano - ADA</option>
                        <option value="XLM">Stellar - XLM</option>
                        <option value="IOT">IOTA - IOT</option>
                        <option value="NEO">NEO - NEO</option>
                        <option value="XMR">Monero - XMR</option>
                        <option value="other">Other...</option>
                      </select>
                      {this.state.buyValue == "other" ? <div><br/><input onChange={this.handleInputChange} name="otherVal" class="form-control" placeholder="Enter Symbol..." type="text"></input></div> : <div></div>}
                    </div>
                    <div class="form-group">
                      <label htmlFor="quantity">Quantity:</label>
                      <input onChange={this.handleInputChange} name="coinQuantity" class="form-control" placeholder="Enter Quantity..." type="number" min="0" step=".00000001"></input>
                    </div>
                    <button type="submit" class="btn btn-default">Add to Portfolio</button>
                  </form>
                 : <form onSubmit={this.handleSellSubmit}>
                    <div class="form-group">
                      <label htmlFor="sel1">Select Coin:</label>
                      <select class="form-control" ref="sellform" value={this.state.sellValue} onChange={this.handleSellChange}>
                        {Object.keys(this.state.wallet).map((key)=>(
                          <option value={key}>{key}</option>    
                        ))}
                      </select>
                    </div>
                    <div class="form-group">
                      <label htmlFor="quantity">Quantity:</label>
                      <input onChange={this.handleInputChange} name="coinQuantity" class="form-control" placeholder="Enter Quantity..." type="number" min="0" step=".00000001"></input>
                    </div>
                    <button type="submit" class="btn btn-default">Remove from Portfolio</button>
                  </form>}
                <div>
                </div>
              </div>

            </div>
          </Modal>
        </div>);
  }
}

export default Portfolio;