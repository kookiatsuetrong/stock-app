import React, {Component} from 'react'
import {AppRegistry, RefreshControl, ScrollView, View, Text} from 'react-native'
class App extends Component {
	constructor() {
		super()
		this.refreshing = false
		this.data = [ ]
		this.refresh()
	}
	refresh() {
		this.refresing = true
		this.read('aapl,goog,msft,fb,amzn,snap,baba,orcl,ibm,' +
			'intc,csco,pcln,adbe,nvda,nflx,bidu,pypl,yhoo,vmw,' +
			'ebay,nok,hpq,intu,ea,adsk,symc,mchp,rht,xlnx,amd,' + 
			'twtr,team,sq,znga,grpn')
		.then( d => {
			this.data = d.query.results.quote
			this.data.sort((a,b) => 
				parseFloat(b.MarketCapitalization) -
				parseFloat(a.MarketCapitalization) )
			this.refreshing = false
			this.forceUpdate()
		})
	}
	read(list) {
		let query = encodeURIComponent(`
			env 'store://datatables.org/alltableswithkeys';
			select * from yahoo.finance.quotes where
			symbol in ('${list}')`)
		let url = `https://query.yahooapis.com/v1/public/yql?q=${query}` +
			`&format=json&diagnostics=false`
		return fetch(url).then( r => r.json() )
	}
	render() {
		let v = {paddingTop:30}
		var s = {fontSize:40, width:120, marginLeft:4}
		var d = {marginTop:8}
		var b = {fontWeight:'bold'}
		var g = {backgroundColor:'lightgray'}, h = {backgroundColor:'white'}
		let item = [ ]
		for (let c of this.data) {
			item.push(<View key={item.length} flexDirection='row'
				style={item.length % 2 == 0 ? g : h }>
				<Text style={s}>{c.symbol.toUpperCase()}</Text>
				<View style={d} flexDirection='column'>
					<Text style={b}>{c.Name}</Text>
					<Text>Market Cap: {c.MarketCapitalization}   P/E: 
						{parseFloat(c.PERatio).toFixed(2)}</Text>
				</View>
			</View>)
		}
		return <ScrollView style={v}
			refreshControl={
				<RefreshControl
					refreshing = { this.refreshing }
					onRefresh = { () => this.refresh() } />
			}>{item}</ScrollView>
	}
}
AppRegistry.registerComponent('App', () => App)